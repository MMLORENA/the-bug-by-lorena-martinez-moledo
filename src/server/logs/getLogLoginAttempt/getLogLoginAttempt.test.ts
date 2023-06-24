import { type NextFunction, type Request, type Response } from "express";
import LogManagerMock from "../../../__mocks__/LogManagerMock";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes";
import { getMockUserCredentials } from "../../../factories/userCredentialsFactory";
import { luisEmail } from "../../../testUtils/mocks/mockUsers";
import type { UserCredentials } from "../../types";
import getLogLoginAttempt from "./getLogLoginAttempt";

const {
  successCodes: { okCode },
} = httpStatusCodes;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a getLogLoginAttempt function", () => {
  const mockLogManager = new LogManagerMock("fakeFolderName");

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

  describe("When it's invoked with a LogManager and it receives a request with email 'luisito@isdicoders.com' and a response", () => {
    test("Then it should invoke the listener function on when the the response close with a statusCode 200'", () => {
      const logLogLoginAttempt = getLogLoginAttempt(mockLogManager);
      logLogLoginAttempt(req as Request, res as Response, next);

      expect(mockResOnClose).toHaveBeenCalled();
    });

    test("Then it should invoke next function", () => {
      const logLoginAttempt = getLogLoginAttempt(mockLogManager);

      logLoginAttempt(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    test("Then it should invoke next function with 'Error on write log to file' as error when the method writeLogToFile failures", () => {
      const mockError = new Error("Error on write log to file");
      const logLoginAttempt = getLogLoginAttempt(mockLogManager);
      mockLogManager.writeLogToFile = jest.fn().mockImplementation(() => {
        throw mockError;
      });

      logLoginAttempt(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
