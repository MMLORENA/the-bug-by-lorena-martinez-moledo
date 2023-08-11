import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import requestHeaders from "../../../../constants/requestHeaders";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import connectDatabase from "../../../../database/connectDatabase";
import User from "../../../../database/models/User";
import { getMockUser } from "../../../../factories/userFactory";
import {
  mockHeaderApiKey,
  mockHeaderApiName,
} from "../../../../testUtils/mocks/mockRequestHeaders";
import {
  luisActivationKey,
  luisEmail,
  luisPassword,
} from "../../../../testUtils/mocks/mockUsers";
import app from "../../../app";
import type { UserActivationCredentials } from "../../../types";
import { paths } from "../../paths";

const { apiKeyHeader, apiNameHeader } = requestHeaders;

const {
  successCodes: { okCode },
  clientErrors: { unauthorizedCode, badRequestCode },
} = httpStatusCodes;

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a POST /users/activate endpoint", () => {
  describe("When it receives a request with an email 'luisito@isdicoders.com', an activationKey 'yuk626sgdeuxwohpg891' and password & confirmPassword 'luisito123'", () => {
    beforeEach(async () => {
      await User.create(
        getMockUser({ email: luisEmail, activationKey: luisActivationKey })
      );
    });

    test("Then it should respond with status 200 and message 'User account has been activated'", async () => {
      const expectedMessage = {
        message: "User account has been activated",
      };

      const response: { body: { message: string } } = await request(app)
        .post(
          `${paths.users.activate}?email=${luisEmail}&activationKey=${luisActivationKey}`
        )
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ password: luisPassword, confirmPassword: luisPassword })
        .expect(okCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request with an email 'luisito@isdicoders.com', password & confirmPassword 'luisito123' and an invalid activationKey", () => {
    beforeEach(async () => {
      await User.create(
        getMockUser({ email: luisEmail, activationKey: luisActivationKey })
      );
    });

    test("Then it should respond with status 401 'User can not be activated'", async () => {
      const invalidActivationKey = new mongoose.Types.ObjectId().toString();
      const expectedMessage = {
        error: "User can not be activated",
      };

      const response = await request(app)
        .post(
          `${paths.users.activate}?email=${luisEmail}&activationKey=${invalidActivationKey}`
        )
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ password: luisPassword, confirmPassword: luisPassword })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request with an email 'luisito@isdicoders.com', password & confirmPassword 'luisito123' and an expired activationKey", () => {
    const expiredDate = new Date(1989, 9, 17);

    beforeEach(async () => {
      await User.create(
        getMockUser({
          email: luisEmail,
          activationKey: luisActivationKey,
          activationKeyExpiry: expiredDate,
        })
      );
    });

    test("Then it should respond with status 401 and message 'User can not be activated'", async () => {
      const expectedMessage = {
        error: "User can not be activated",
      };

      const response = await request(app)
        .post(
          `${paths.users.activate}?email=${luisEmail}&activationKey=${luisActivationKey}`
        )
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ password: luisPassword, confirmPassword: luisPassword })
        .expect(unauthorizedCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request with an email 'luisito@isdicoders.com', a valid activationKey and password 'luisito123' and confirmPassword 'luisito1234'", () => {
    test("Then it should respond with status 400 and message 'Passwords must match'", async () => {
      const expectedMessage = { error: "Passwords must match" };
      const activationBody: UserActivationCredentials = {
        password: "luisito123",
        confirmPassword: "luisito1234",
      };

      const response = await request(app)
        .post(
          `${paths.users.activate}?email=${luisEmail}&activationKey=${luisActivationKey}`
        )
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send(activationBody)
        .expect(badRequestCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request without email nor activation key", () => {
    test("Then it should respond with status 400 and message 'Email is required & activationKey is required'", async () => {
      const expectedMessage = {
        error: "Email is required & activationKey is required",
      };
      const activationBody: UserActivationCredentials = {
        password: luisPassword,
        confirmPassword: luisPassword,
      };

      const response = await request(app)
        .post(`${paths.users.activate}`)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send(activationBody)
        .expect(badRequestCode);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });
});
