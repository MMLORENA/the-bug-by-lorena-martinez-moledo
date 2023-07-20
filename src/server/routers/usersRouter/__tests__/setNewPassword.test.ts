import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import requestHeaders from "../../../../constants/requestHeaders";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import connectDatabase from "../../../../database/connectDatabase";
import User from "../../../../database/models/User";
import { getMockUser } from "../../../../factories/userFactory";
import {
  luisActivationKey,
  luisEmail,
  luisPassword,
} from "../../../../testUtils/mocks/mockUsers";
import mongoose from "mongoose";
import app from "../../../app";
import { paths } from "../../paths";
import {
  mockHeaderApiKey,
  mockHeaderApiName,
} from "../../../../testUtils/mocks/mockRequestHeaders";

const { apiKeyHeader, apiNameHeader } = requestHeaders;

const {
  successCodes: { okCode },
  clientErrors: { unauthorizedCode },
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

describe("Given a POST /users/set-new-password endpoint", () => {
  describe("When it receives a request with an email 'luisito@isdicoders.com' and an activationKey 'yuk626sgdeuxwohpg891'", () => {
    beforeEach(async () => {
      await User.create(
        getMockUser({ email: luisEmail, activationKey: luisActivationKey })
      );
    });

    test("Then it should respond with status 200 and a message 'User's new password has been set'", async () => {
      const expectedMessage = "User's new password has been set";

      const response: { body: { message: string } } = await request(app)
        .post(
          `${paths.users.setNewPassword}?email=${luisEmail}&activationKey=${luisActivationKey}`
        )
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ password: luisPassword })
        .expect(okCode);

      expect(response.body).toHaveProperty("message", expectedMessage);
    });
  });

  describe("When it receives a request with an email 'luisito@isdicoders.com' and has no activationKey", () => {
    beforeEach(async () => {
      await User.create(
        getMockUser({
          email: luisEmail,
          activationKey: "",
        })
      );
    });

    test("Then it should respond with status 401 and a message 'User can not be activated'", async () => {
      const expectedErrorMessage = "User can not be activated";

      const response: { body: { message: string } } = await request(app)
        .post(
          `${paths.users.setNewPassword}?email=${luisEmail}&activationKey=${luisActivationKey}`
        )
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ password: luisPassword })
        .expect(unauthorizedCode);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });

  describe("When it receives a request with an email 'luisito@isdicoders.com' and a different activtionKey than the one saved in the data base", () => {
    beforeEach(async () => {
      await User.create(
        getMockUser({
          email: luisEmail,
          activationKey: "afgsdfgsgh",
        })
      );
    });
    test("Then it should respond with status 401 and the message 'User can not be activated'", async () => {
      const expectedErrorMessage = "User can not be activated";

      const response: { body: { message: string } } = await request(app)
        .post(
          `${paths.users.setNewPassword}?email=${luisEmail}&activationKey=${luisActivationKey}`
        )
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ password: luisPassword })
        .expect(unauthorizedCode);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });

  describe("When it receives a request with an email 'luisito@isdicoders.com' and an expired activationKey", () => {
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

    test("Then it should respond with status 401 and a message 'User can not be activated'", async () => {
      const expectedErrorMessage = "User can not be activated";

      const response: { body: { message: string } } = await request(app)
        .post(
          `${paths.users.setNewPassword}?email=${luisEmail}&activationKey=${luisActivationKey}`
        )
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ password: luisPassword })
        .expect(unauthorizedCode);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });
});
