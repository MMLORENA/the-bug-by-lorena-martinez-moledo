import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import request from "supertest";
import config from "../../../../config";
import requestHeaders from "../../../../constants/requestHeaders";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import connectDatabase from "../../../../database/connectDatabase";
import User from "../../../../database/models/User";
import { environment } from "../../../../environment/loadEnvironments";
import { getMockUser } from "../../../../factories/userFactory";
import {
  mockHeaderApiKey,
  mockHeaderApiName,
} from "../../../../testUtils/mocks/mockRequestHeaders";
import { generateMockToken } from "../../../../testUtils/mocks/mockToken";
import app from "../../../app";
import { paths } from "../../paths";

const { apiKeyHeader, apiNameHeader } = requestHeaders;

const {
  clientErrors: { notFoundCode, badRequestCode, forbiddenCode },
  successCodes: { okCode },
} = httpStatusCodes;

const { logsRootFolder } = environment;

let server: MongoMemoryServer;

const validDate = "01-01-1970";
const fakeFolderYearPath = path.join(logsRootFolder, "1970");
const fakeFoldersPath = path.join(fakeFolderYearPath, "01");
const fakePath = path.join(fakeFoldersPath, "01011970");

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

const {
  singleSignOnCookie: { cookieName },
} = config;

describe("Given a GET '/logs/log' endpoint", () => {
  let userId: string;

  const newAdminUserData = getMockUser({ isAdmin: true });
  let adminCookie: string;

  beforeEach(async () => {
    const newUser = await User.create(newAdminUserData);
    userId = newUser._id.toString();

    const mockToken = generateMockToken({ id: userId });
    adminCookie = `${cookieName}=${mockToken}`;
  });

  describe("When it receives a request with '01-01-1970' and a cookie of an admin user", () => {
    describe("And exists a log for that date", () => {
      const mockLog = "log";

      beforeEach(() => {
        fs.mkdirSync(fakeFoldersPath, { recursive: true });
        fs.writeFileSync(fakePath, mockLog);
      });

      afterEach(() => {
        fs.rmSync(fakeFolderYearPath, { recursive: true, force: true });
      });

      test("Then it should respond with status 200 and log: 'log'", async () => {
        const response = await request(app)
          .get(`${paths.logs.logByDate}?date=${validDate}`)
          .set("Cookie", [adminCookie])
          .set(apiKeyHeader, mockHeaderApiKey)
          .set(apiNameHeader, mockHeaderApiName)
          .expect(okCode);

        expect(response.body).toHaveProperty("log", mockLog);
      });
    });

    describe("And it doesn't exist a file for that date", () => {
      test("Then it should respond with status 404 and an error: 'Log not Available'", async () => {
        const expectedErrorMessage = "Log not available";

        const response = await request(app)
          .get(`${paths.logs.logByDate}?date=${validDate}`)
          .set("Cookie", [adminCookie])
          .set(apiKeyHeader, mockHeaderApiKey)
          .set(apiNameHeader, mockHeaderApiName)
          .expect(notFoundCode);

        expect(response.body).toHaveProperty("error", expectedErrorMessage);
      });
    });
  });

  describe("When it receives a request with '1970-01-01'", () => {
    test("Then it should respond with status 400 and an error 'Invalid date format. Format must be DD-MM-YYYY'", async () => {
      const invalidDateFormat = "1970-01-01";
      const expectedError = "Invalid date format. Format must be DD-MM-YYYY";

      const response = await request(app)
        .get(`${paths.logs.logByDate}?date=${invalidDateFormat}`)
        .set("Cookie", [adminCookie])
        .set(apiKeyHeader, mockHeaderApiKey)
        .set(apiNameHeader, mockHeaderApiName)
        .expect(badRequestCode);

      expect(response.body).toHaveProperty("error", expectedError);
    });

    describe("And the user isn't admin", () => {
      test("Then it should return with status 403 an error 'Forbidden'", async () => {
        const expectedError = "Forbidden";
        const mockNotAdminToken = generateMockToken();
        const notAdminCookie = `${cookieName}=${mockNotAdminToken}`;

        const response = await request(app)
          .get(`${paths.logs.logByDate}?date=${validDate}`)
          .set("Cookie", [notAdminCookie])
          .set(apiKeyHeader, mockHeaderApiKey)
          .set(apiNameHeader, mockHeaderApiName)
          .expect(forbiddenCode);

        expect(response.body).toHaveProperty("error", expectedError);
      });
    });
  });
});
