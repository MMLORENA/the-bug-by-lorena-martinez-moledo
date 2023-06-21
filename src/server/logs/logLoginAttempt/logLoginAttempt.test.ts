import type { NextFunction, Request, Response } from "express";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes";
import { getMockUserCredentials } from "../../../factories/userCredentialsFactory";
import { luisEmail } from "../../../testUtils/mocks/mockUsers";
import type { UserCredentials } from "../../types";
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

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("Given a logLoginAttempt middleware", () => {
  describe("When it receives a request with email 'luisito@isdicoders.com' and a response", () => {
    test("Then it should invoke the listener function on when the the response close with a statusCode 200'", () => {
      const loginSessionManagerMock = jest.spyOn(
        LogManager.prototype,
        "writeLogToFile"
      );

      const mockWriteLogToFile = jest.fn();
      loginSessionManagerMock.mockImplementation(mockWriteLogToFile);

      logLoginAttempt(
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

    test("Then it should invoke next function", () => {
      const loginSessionManagerMock = jest.spyOn(
        LogManager.prototype,
        "writeLogToFile"
      );
      const mockWriteLogToFile = jest.fn();
      loginSessionManagerMock.mockImplementation(mockWriteLogToFile);

      logLoginAttempt(
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

    test("Then it should invoke next function with 'Error on write log to file' as error when the method writeLogToFile failures", () => {
      const loginSessionManagerMock = jest.spyOn(
        LogManager.prototype,
        "writeLogToFile"
      );
      const mockError = new Error("Error on write log to file");

      const mockWriteLogToFile = jest.fn().mockImplementation(() => {
        throw mockError;
      });
      loginSessionManagerMock.mockImplementation(mockWriteLogToFile);

      logLoginAttempt(
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
