import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import config from "../../../config";
import authErrors from "../../../constants/errors/authErrors";
import requestHeaders from "../../../constants/requestHeaders";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import connectDatabase from "../../../database/connectDatabase";
import User from "../../../database/models/User.js";
import { getMockUserData } from "../../../factories/userDataFactory";
import { getMockUser } from "../../../factories/userFactory";
import { environment } from "../../../environment/loadEnvironments";
import cookieParser from "../../../testUtils/cookieParser";
import {
  mockHeaderApiKey,
  mockHeaderApiName,
} from "../../../testUtils/mocks/mockRequestHeaders";
import {
  generateMockToken,
  mockTokenPayload,
} from "../../../testUtils/mocks/mockToken";
import {
  luisEmail,
  luisName,
  martaEmail,
} from "../../../testUtils/mocks/mockUsers";
import app from "../../app.js";
import type {
  CustomTokenPayload,
  UserActivationCredentials,
  UserData,
  UserStructure,
  UserWithId,
} from "../../types";
import { paths } from "../paths";

jest.mock("../../logs/LogManager/LogManager");
jest.mock("../../../email/sendEmail/sendEmail.js");

const { apiKeyHeader, apiNameHeader } = requestHeaders;

const {
  singleSignOnCookie: { cookieName },
} = config;

const randomUserCookie = `${cookieName}=${generateMockToken()}`;
const incorrectCookie = `${cookieName}=incorrect-cookie`;

const {
  successCodes: { createdCode, okCode, noContentSuccessCode },
  clientErrors: {
    conflictCode,
    badRequestCode,
    unauthorizedCode,
    notFoundCode,
  },
} = httpStatusCodes;

const {
  jwt: { jwtSecret },
} = environment;

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given a POST /users/register endpoint", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  describe("When it receives a request with name 'Luis', email 'luisito@isdicoders.com' and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 201 and the user's credentials in the body", async () => {
      const newUser = getMockUserData({ name: luisName, email: luisEmail });

      const response: { body: { user: UserStructure } } = await request(app)
        .post(paths.users.register)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send(newUser)
        .expect(createdCode);

      const {
        user: { name, email },
      } = response.body;

      expect(name).toBe(newUser.name);
      expect(email).toBe(newUser.email);
    });
  });

  describe("When it receives a request with email 'marta@isdicoders.com' and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    const existingUser = getMockUserData({ email: martaEmail });

    beforeEach(async () => {
      await User.create(existingUser);
    });

    test("Then it should respond with code 409 and 'User already exists'", async () => {
      const expectedError = "User already exists";

      const response = await request(app)
        .post(paths.users.register)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send(existingUser)
        .expect(conflictCode);

      expect(response.body).toHaveProperty("error", expectedError);
    });
  });

  describe("When it receives a request with an empty name and empty email and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 400 and in the body 'Name shouldn't be empty, Email shouldn't be empty'", async () => {
      const emptyUser: UserData = {
        name: "",
        email: "",
      };
      const expectedMessage = [
        "Name shouldn't be empty",
        "Email shouldn't be empty",
      ].join(" & ");

      const response = await request(app)
        .post(paths.users.register)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send(emptyUser)
        .expect(badRequestCode);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });

  describe("When it receives a request with name 'Luis', email 'luisito@isdicoders.com' and an incorrect api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 401 and the error 'Invalid API Key'", async () => {
      const newUser = getMockUserData({ name: luisName, email: luisEmail });
      const incorrectmockHeaderApiKey = "incorrect key";
      const expectedErrorMessage = "Invalid API Key";

      const response: { body: { error: string } } = await request(app)
        .post(paths.users.register)
        .set(apiKeyHeader, incorrectmockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send(newUser)
        .expect(unauthorizedCode);

      const { error } = response.body;

      expect(error).toBe(expectedErrorMessage);
    });
  });
});

describe("Given a POST /users/login endpoint", () => {
  const wrongCredentialsError = { error: "Incorrect email or password" };

  const luisitoUser = getMockUser({ email: luisEmail });
  let luisitoId: mongoose.Types.ObjectId;

  const martitaUser = getMockUser({ email: martaEmail });

  beforeAll(async () => {
    const luisitoHashedPassword = await bcrypt.hash(luisitoUser.password, 10);

    const martitaHashedPassword = await bcrypt.hash(martitaUser.password, 10);

    const luisito = await User.create({
      ...luisitoUser,
      password: luisitoHashedPassword,
      isActive: true,
    });

    luisitoId = luisito._id;

    await User.create({
      ...martitaUser,
      password: martitaHashedPassword,
    });
  });

  afterAll(async () => {
    await User.deleteMany();
  });

  describe("When it receives a request with email 'luisito@isdicoders.com', a correct password and the user is registered and active and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 200 and a Set-cookie header with a token", async () => {
      const { email, password } = luisitoUser;

      const response = await request(app)
        .post(paths.users.login)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ email, password })
        .expect(okCode);

      expect(response.body).toHaveProperty("message");

      const { message } = response.body as { message: string };
      const [identityCookie] = response.get("Set-Cookie");
      const parsedCookie = cookieParser(identityCookie);
      const token = parsedCookie.coders_identity_token;
      const tokenPayload = jwt.decode(token as string);

      expect(message).toBe("coders_identity_token has been set");
      expect(tokenPayload as CustomTokenPayload).toHaveProperty(
        "id",
        luisitoId.toString()
      );
    });
  });

  describe("When it receives a request with email 'luisito@isdicoders.com' and incorrect password 'luisito1' and the user is registered and active and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with error 'Incorrect email or password'", async () => {
      const { email } = luisitoUser;
      const incorrectPassword = "luisito1";

      const response = await request(app)
        .post(paths.users.login)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ email, password: incorrectPassword })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(wrongCredentialsError);
    });
  });

  describe("When it receives a request with email 'martita@isdicoders.com' a password, and the user exists but is inactive and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 401 and message 'User is inactive, contact your administrator if you think this is a mistake'", async () => {
      const { email, password } = martitaUser;
      const inactiveUserError = {
        error:
          "User is inactive, contact your administrator if you think this is a mistake",
      };

      const response = await request(app)
        .post(paths.users.login)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ email, password })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(inactiveUserError);
    });
  });

  describe("When it receives a request with invalid email 'luisito' and short password 'luisito' and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 400 and the errors 'Email must be a valid email'", async () => {
      const expectedErrors = {
        error: ["Email must be a valid email"].join(" & "),
      };
      const email = "luisito";
      const password = "luisito";

      const response = await request(app)
        .post(paths.users.login)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ email, password })
        .expect(badRequestCode);

      expect(response.body).toStrictEqual(expectedErrors);
    });
  });
});

describe("Given a POST /users/activate endpoint", () => {
  const luisitoPassword = "luisito123";
  let luisitoId: string;
  const activationBody = {
    password: luisitoPassword,
    confirmPassword: luisitoPassword,
  };

  beforeEach(async () => {
    const luisitoData = getMockUserData({ email: luisEmail });
    const luisitoUser = await User.create({
      ...luisitoData,
    });

    luisitoId = luisitoUser._id.toString();
    luisitoUser.activationKey = await bcrypt.hash(luisitoId, 10);

    await luisitoUser.save();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  describe("When it receives query string activationKey and password & confirmPassword 'luisito123' and the activation key is correct and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 200 and message 'User account has been activated'", async () => {
      const expectedMessage = {
        message: "User account has been activated",
      };

      const response = await request(app)
        .post(`${paths.users.activate}?activationKey=${luisitoId}`)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send(activationBody)
        .expect(okCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives query string activationKey and it is invalid and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 401 'Invalid activation key'", async () => {
      const invalidActivationKey = new mongoose.Types.ObjectId().toString();
      const expectedMessage = {
        error: "Invalid activation key",
      };

      const response = await request(app)
        .post(`${paths.users.activate}?activationKey=${invalidActivationKey}`)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send(activationBody)
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives query string activationKey with correct ID but the stored hash has expired and it receives a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    const martitaPassword = "martita123";
    let martitaId: string;
    const activationBody = {
      password: martitaPassword,
      confirmPassword: martitaPassword,
    };

    beforeEach(async () => {
      const martitaData = getMockUser({ email: martaEmail });
      const martitaUser = await User.create({
        ...martitaData,
      });

      martitaId = martitaUser._id.toString();

      await martitaUser.save();
    });

    test("Then it should respond with status 401 and message 'Invalid activation key'", async () => {
      const expectedMessage = {
        error: "Invalid activation key",
      };

      const response = await request(app)
        .post(`${paths.users.activate}?activationKey=${martitaId}`)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send(activationBody)
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives query string activationKey, and in the body password 'luisito123' and confirmPassword 'luisito1234' and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 400 and message 'Passwords must match'", async () => {
      const activationKey = new mongoose.Types.ObjectId().toString();
      const expectedMessage = { error: "Passwords must match" };
      const activationBody: UserActivationCredentials = {
        password: "luisito123",
        confirmPassword: "luisito1234",
      };

      const response = await request(app)
        .post(`${paths.users.activate}?activationKey=${activationKey}`)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send(activationBody)
        .expect(badRequestCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });
});

describe("Given a GET /users/verify-token endpoint", () => {
  describe("When it receives a request with no cookie and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 401 and 'Unauthorized' error message ", async () => {
      const expectedStatus = unauthorizedCode;
      const { publicMessage: expectedMessage } = authErrors.noToken;

      const response: {
        body: { userPayload: CustomTokenPayload };
      } = await request(app)
        .get(paths.users.verifyToken)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });

  describe("When it receives a request with a cookie and a valid token and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 200 and userPayload in the body", async () => {
      const expectedStatus = okCode;

      const response: {
        body: { userPayload: CustomTokenPayload };
      } = await request(app)
        .get(paths.users.verifyToken)
        .set("Cookie", [randomUserCookie])
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send(mockTokenPayload)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("userPayload", mockTokenPayload);
    });
  });

  describe("When it receives a request with a cookie that contains an invalid token and a correct api key in the header 'X-API-KEY' and 'api-gateway' in the header 'X-API-NAME'", () => {
    test("Then it should respond with status 401 and error message 'Unauthorized'", async () => {
      const expectedStatus = unauthorizedCode;
      const expectedMessage = "Unauthorized";

      const response: {
        body: { userPayload: CustomTokenPayload };
      } = await request(app)
        .get(paths.users.verifyToken)
        .set("Cookie", [incorrectCookie])
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});

describe("Given a POST /users/logout endpoint", () => {
  describe("When it receives a request with a cookie", () => {
    test("Then it should respond without a cookie and a status 204", async () => {
      const response = await request(app)
        .post(paths.users.logout)
        .set("Cookie", [randomUserCookie])
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .expect(noContentSuccessCode);

      expect(response.headers).not.toHaveProperty("Cookie", [randomUserCookie]);
    });
  });
});

describe("Given a GET /users/user-data endpoint", () => {
  let userId: string;
  const newUserData = {
    ...getMockUserData({ name: luisName }),
    isAdmin: false,
  };

  beforeEach(async () => {
    const newUser = await User.create(newUserData);
    userId = newUser._id.toString();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  describe("When it receives a request with a correct api-key and api-name with a valid token cookie with an existant user name 'luis' in DB", () => {
    test("Then it should respond with status 200 and the 'luis' user data information in the body", async () => {
      const mockUserPayload: CustomTokenPayload = {
        name: newUserData.name,
        isAdmin: newUserData.isAdmin,
        id: userId,
      };

      const mockLuisToken = jwt.sign(mockUserPayload, jwtSecret);
      const userLuisCookie = `${cookieName}=${mockLuisToken}`;

      const expectedStatus = okCode;

      const response: {
        body: { user: UserWithId };
      } = await request(app)
        .get(paths.users.userData)
        .set("Cookie", [userLuisCookie])
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("user", {
        name: newUserData.name,
        email: newUserData.email,
        isAdmin: newUserData.isAdmin,
      });
    });
  });

  describe("When it receives a request with a correct api-key and api-name with a valid token cookie with a non-existant user in DB", () => {
    test("Then it should respond with status 404 and message 'User data not available'", async () => {
      const expectedStatus = notFoundCode;
      const expectedMessage = `User data not available`;

      const response: {
        body: { user: UserWithId };
      } = await request(app)
        .get(paths.users.userData)
        .set("Cookie", [randomUserCookie])
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
