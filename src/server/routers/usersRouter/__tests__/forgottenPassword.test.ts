import request from "supertest";
import app from "../../../app";
import { paths } from "../../paths";
import { luisEmail, martaEmail } from "../../../../testUtils/mocks/mockUsers";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../../database/connectDatabase";
import mongoose from "mongoose";
import User from "../../../../database/models/User";
import { getMockUser } from "../../../../factories/userFactory";
import requestHeaders from "../../../../constants/requestHeaders";
import { mockHeaderApiKey } from "../../../../testUtils/mocks/mockRequestHeaders";
import { mockHeaderApiName } from "../../../../testUtils/mocks/mockRequestHeaders";

const { apiKeyHeader, apiNameHeader } = requestHeaders;

const {
  successCodes: { okCode },
  clientErrors: { notFoundCode },
} = httpStatusCodes;

jest.mock("../../../../email/sendEmail/sendEmail");

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());

  await User.create(getMockUser({ email: luisEmail }));
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given a GET /users/forgotten-password endpoint", () => {
  describe("When it receives a request with an email 'luisito@isdicoders.com'", () => {
    test("Then it should respond with status 200 and a message 'Email sent'", async () => {
      const expectedMessage = "Email sent";

      const response: { body: { message: string } } = await request(app)
        .post(paths.users.forgottenPassword)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ email: luisEmail })
        .expect(okCode);

      expect(response.body).toHaveProperty("message", expectedMessage);
    });
  });

  describe("When it receives a request with a wrong email 'martita@isdicoders.com'", () => {
    test("Then it should respond with status 404 and a message 'User not found'", async () => {
      const expectedMessage = "User not found";

      const response: { body: { message: string } } = await request(app)
        .post(paths.users.forgottenPassword)
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .send({ email: martaEmail })
        .expect(notFoundCode);

      expect(response.body).toHaveProperty("error", expectedMessage);
    });
  });
});
