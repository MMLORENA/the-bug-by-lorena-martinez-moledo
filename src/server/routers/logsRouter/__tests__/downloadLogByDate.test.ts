import fs from "node:fs";
import path from "node:path";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../../database/connectDatabase";
import User from "../../../../database/models/User";
import mongoose from "mongoose";
import { environment } from "../../../../environment/loadEnvironments";
import app from "../../../app";
import { paths } from "../../paths";
import { getMockUser } from "../../../../factories/userFactory";
import { generateMockToken } from "../../../../testUtils/mocks/mockToken";
import config from "../../../../config";
import requestHeaders from "../../../../constants/requestHeaders";
import {
  mockHeaderApiKey,
  mockHeaderApiName,
} from "../../../../testUtils/mocks/mockRequestHeaders";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";

let server: MongoMemoryServer;

const { logsRootFolder } = environment;

const { apiKeyHeader, apiNameHeader } = requestHeaders;

const {
  successCodes: { okCode },
  clientErrors: { notFoundCode },
} = httpStatusCodes;

const validDate = "01-01-1970";
const fakeFolderYearPath = path.join(logsRootFolder, "1970");
const fakeFoldersPath = path.join(fakeFolderYearPath, "01");
const fakePath = path.join(fakeFoldersPath, "01011970");

const {
  singleSignOnCookie: { cookieName },
} = config;

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

describe("Given a GET '/logs/download' endpoint", () => {
  let adminCookie: string;
  let userId: string;
  const newAdminUserData = getMockUser({ isAdmin: true });

  beforeEach(async () => {
    const newUser = await User.create(newAdminUserData);
    userId = newUser._id.toString();

    const mockToken = generateMockToken({ id: userId });
    adminCookie = `${cookieName}=${mockToken}`;
  });

  describe("When it receives a request with '01-01-1970' and a cookie of an admin user", () => {
    describe("And a log for that date exists", () => {
      const mockLog = "log";

      beforeEach(() => {
        fs.mkdirSync(fakeFoldersPath, { recursive: true });
        fs.writeFileSync(fakePath, mockLog);
      });

      afterEach(() => {
        fs.rmSync(fakeFolderYearPath, { recursive: true, force: true });
      });

      test("Then it should respond with status 200", async () => {
        const response = await request(app)
          .get(`${paths.logs.downloadLogByDate}?date=${validDate}`)
          .set("Cookie", [adminCookie])
          .set(apiKeyHeader, mockHeaderApiKey)
          .set(apiNameHeader, mockHeaderApiName)
          .expect(okCode);

        expect(response).toHaveProperty("body");
      });
    });
  });

  describe("When it receives a request with '01-01-3020' and a cookie of an admin user", () => {
    describe("And a log for that date doesn't exist", () => {
      test("Then it should respond with status 404", async () => {
        const futureDate = "01-01-3020";

        const response = await request(app)
          .get(`${paths.logs.downloadLogByDate}?date=${futureDate}`)
          .set("Cookie", [adminCookie])
          .set(apiKeyHeader, mockHeaderApiKey)
          .set(apiNameHeader, mockHeaderApiName)
          .expect(notFoundCode);

        expect(response).toHaveProperty("body");
      });
    });
  });
});
