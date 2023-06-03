import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes";
import { luisEmail, martaEmail } from "../../../testUtils/mocks/mockUsers";
import type { LogData } from "../types";
import Log from "./Log";

const {
  successCodes: { okCode },
  clientErrors: { unauthorizedCode },
} = httpStatusCodes;

const fakeDate = new Date("1970-01-01T00:00:00.000");

beforeAll(() => {
  jest.useFakeTimers();
});

beforeEach(() => {
  jest.setSystemTime(fakeDate);
});

afterAll(() => {
  jest.useRealTimers();
});

describe("Given a Log Class", () => {
  describe("When it's instanciated and recives email: 'luisito@isdicoders.com' and 200 as response statusCode", () => {
    test("Then it should have properties email: 'luisito@isdicoders.com', time: 1970-01-01T00:00:00.000 and status: 1", () => {
      const expectedLogData: LogData = {
        email: luisEmail,
        status: 1,
        time: fakeDate,
      };

      const log = new Log(luisEmail, okCode);

      expect(log).toHaveProperty("email", expectedLogData.email);
      expect(log).toHaveProperty("time", expectedLogData.time);
      expect(log).toHaveProperty("status", expectedLogData.status);
    });
  });

  describe("When it's instanciated and recives email: 'martita@isdicoders.com' and 401 as response statusCode", () => {
    test("Then it should have properties email: 'luisito@isdicoders.com', time: 1970-01-01T00:00:00.000 and status: 0", () => {
      const expectedLogData: LogData = {
        email: martaEmail,
        status: 0,
        time: fakeDate,
      };

      const log = new Log(martaEmail, unauthorizedCode);

      expect(log).toHaveProperty("email", expectedLogData.email);
      expect(log).toHaveProperty("time", expectedLogData.time);
      expect(log).toHaveProperty("status", expectedLogData.status);
    });
  });
});