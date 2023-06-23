import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import requestHeaders from "../../../../constants/requestHeaders";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import connectDatabase from "../../../../database/connectDatabase";
import User from "../../../../database/models/User";
import { getMockUser } from "../../../../factories/userFactory";
import {
  luisEmail,
  luisPassword,
  luisUserId,
} from "../../../../testUtils/mocks/mockUsers";
import mongoose from "mongoose";
import app from "../../../app";
import { paths } from "../../paths";
import {
  mockHeaderApiKey,
  mockHeaderApiName,
} from "../../../../testUtils/mocks/mockRequestHeaders";
import HasherBcrypt from "../../../../utils/HasherBcrypt/HasherBcrypt";

const { apiKeyHeader, apiNameHeader } = requestHeaders;

const {
  successCodes: { okCode },
  clientErrors: { unauthorizedCode },
} = httpStatusCodes;

let server: MongoMemoryServer;

const hasher = new HasherBcrypt();

afterEach(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given a POST /users/set-new-password endpoint", () => {
  describe("When it receives a request with an email 'luisito@isdicoders.com' and an userId '64958cc023867fd1c89456ee'", () => {
    beforeEach(async () => {
      server = await MongoMemoryServer.create();
      await connectDatabase(server.getUri());

      const luisUser = await User.create(
        getMockUser({ email: luisEmail, _id: luisUserId.toString() })
      );

      luisUser.activationKey = await hasher.hash(luisUserId);

      await luisUser.save();
    });

    test("Then it should respond with status 200 and a message 'User's new password has been set'", async () => {
      const expectedMessage = "User's new password has been set";

      const response: { body: { message: string } } = await request(app)
        .post(
          `${
            paths.users.setNewPassword
          }?email=${luisEmail}&activationKey=${luisUserId.toString()}`
        )
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ password: luisPassword })
        .expect(okCode);

      expect(response.body).toHaveProperty("message", expectedMessage);
    });
  });

  describe("When it receives a request with an email 'luisito@isdicoders.com' and an expired activationKey", () => {
    const expiredDate = new Date(1989, 9, 17);

    beforeEach(async () => {
      server = await MongoMemoryServer.create();
      await connectDatabase(server.getUri());

      const luisUser = await User.create(
        getMockUser({
          email: luisEmail,
          _id: luisUserId.toString(),
          activationKeyExpiry: expiredDate,
        })
      );

      luisUser.activationKey = await hasher.hash(luisUserId);

      await luisUser.save();
    });

    test("Then it should respond with status 401 and a message 'Invalid activation key'", async () => {
      const expectedErrorMessage = "Invalid activation key";

      const response: { body: { message: string } } = await request(app)
        .post(
          `${
            paths.users.setNewPassword
          }?email=${luisEmail}&activationKey=${luisUserId.toString()}`
        )
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ password: luisPassword })
        .expect(unauthorizedCode);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });
});
