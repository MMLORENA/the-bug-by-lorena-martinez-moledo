import jwt from "jsonwebtoken";
import request from "supertest";
import User from "../../../database/models/User";
import { getMockUser } from "../../../factories/userFactory";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import config from "../../../config";
import requestHeaders from "../../../constants/requestHeaders";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes";
import connectDatabase from "../../../database/connectDatabase";
import { environment } from "../../../environment/loadEnvironments";
import {
  mockHeaderApiKey,
  mockHeaderApiName,
} from "../../../testUtils/mocks/mockRequestHeaders";
import app from "../../app";
import { paths } from "../paths";

const {
  jwt: { jwtSecret },
} = environment;

const {
  successCodes: { okCode },
  clientErrors: { forbiddenCode },
} = httpStatusCodes;
const { apiKeyHeader, apiNameHeader } = requestHeaders;

const {
  singleSignOnCookie: { cookieName },
} = config;

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given a GET /users/get-logs endpoint", () => {
  let userId: string;

  describe("When it receives a request with a correct API key and API name with a valid token cookie and the user making the request is an administrator", () => {
    const newAdminUserData = getMockUser({ isAdmin: true });

    beforeEach(async () => {
      const newUser = await User.create(newAdminUserData);
      userId = newUser._id.toString();
    });

    afterEach(async () => {
      await User.deleteMany();
    });

    test("Then it should respond with status 200 and a collection of the names of the log files existing in the last 30 days", async () => {
      const mockAdminUserPayload = {
        name: newAdminUserData.name,
        isAdmin: newAdminUserData.isAdmin,
        id: userId,
      };
      const mockToken = jwt.sign(mockAdminUserPayload, jwtSecret);
      const userCookie = `${cookieName}=${mockToken}`;
      const expectedStatus = okCode;

      const response = await request(app)
        .get(paths.logs.base)
        .set("Cookie", [userCookie])
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("logFiles");
    });
  });

  describe("When it receives a request with a correct API key and API name with a valid token cookie and the user making the request not is an administrator", () => {
    const newNotAdminUserData = getMockUser({ isAdmin: false });

    beforeEach(async () => {
      const newUser = await User.create(newNotAdminUserData);
      userId = newUser._id.toString();
    });

    afterEach(async () => {
      await User.deleteMany();
    });

    test("Then it should respond with status 401 and a error message 'User does not have administrator permissions'", async () => {
      const expectedStatus = forbiddenCode;
      const expectedError = "Forbidden";
      const mockNotAdminUserPayload = {
        name: newNotAdminUserData.name,
        isAdmin: newNotAdminUserData.isAdmin,
        id: userId,
      };
      const mockToken = jwt.sign(mockNotAdminUserPayload, jwtSecret);
      const userCookie = `${cookieName}=${mockToken}`;

      const response = await request(app)
        .get(paths.logs.base)
        .set("Cookie", [userCookie])
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedError);
    });
  });
});
