import type { NextFunction, Request, Response } from "express";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import { getMockUserCredentials } from "../../../../factories/userCredentialsFactory";
import { luisEmail } from "../../../../testUtils/mocks/mockUsers";
import type { UserCredentials } from "../../../types";
import LogManager from "../LogManager/LogManager";
import logLoginAttempt from "./logLoginAttempt";

const {
  successCodes: { okCode },
} = httpStatusCodes;

const mockUserCredentials = getMockUserCredentials({ email: luisEmail });

const req: Partial<
  Request<Record<string, unknown>, Record<string, unknown>, UserCredentials>
> = {
  body: mockUserCredentials,
};

const mockResOnClose = jest
  .fn()
  .mockImplementation((event, callback: () => void) => {
    if (event === "close") {
      callback();
    }
  });

const res: Partial<Response> = {
  on: mockResOnClose,
  statusCode: okCode,
};

const next: NextFunction = jest.fn();

const loginSessionManagerMock = jest.spyOn(
  LogManager.prototype,
  "writeLogToFile"
);
const mockWriteLogToFile = jest.fn().mockResolvedValue(null);
loginSessionManagerMock.mockImplementation(mockWriteLogToFile);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a logLoginAttempt middleware", () => {
  describe("When it receives a request with email 'luisito@isdicoders.com' and a response", () => {
    test("Then it should invoke the listener function on when the the response close with a statusCode 200'", async () => {
      await logLoginAttempt(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(mockResOnClose).toHaveBeenCalled();
    });

    test("Then it should invoke next function", async () => {
      await logLoginAttempt(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalled();
    });

    test("Then it should invoke next function with an Error when the listener function failures", async () => {
      const mockError = new Error();
      const mockWriteLogToFile = jest.fn().mockRejectedValue(mockError);

      loginSessionManagerMock.mockImplementation(mockWriteLogToFile);

      await logLoginAttempt(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
