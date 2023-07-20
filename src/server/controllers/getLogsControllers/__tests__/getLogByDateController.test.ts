import type { NextFunction, Response } from "express";
import LogManagerMock from "../../../../__mocks__/LogManagerMock";
import logsErrors from "../../../../constants/errors/logsErrors";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import type { LogByDateRequest } from "../../../types";
import { getLogByDateController } from "../getLogsControllers";

const {
  successCodes: { okCode },
} = httpStatusCodes;

describe("Given a getLogByDateController", () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  describe("When it's invoked with a logManager and it receives a request with date in params '1970-01-01T00:00:00.000' and a response", () => {
    const req: Partial<LogByDateRequest> = {
      params: {
        date: "1970-01-01T00:00:00.000",
      },
    };

    test("Then it should invoke response's method status with 200 and json with the log", () => {
      const expectedLog = "log";
      const mockLockManager = new LogManagerMock("fakeRootFolderName");
      const logByDateController = getLogByDateController(mockLockManager);

      logByDateController(
        req as LogByDateRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({ log: expectedLog });
    });

    test("Then it should invoke next function with error 'ENOENT: no such file or directory' when the log is not found", () => {
      const expectedCustomError = logsErrors.noLogAvailable(
        "ENOENT: no such file or directory"
      );
      const mockLockManager = new LogManagerMock("fakeRootFolderName");
      mockLockManager.readLogFromFile = jest.fn(() => {
        throw expectedCustomError;
      });

      const logByDateController = getLogByDateController(mockLockManager);

      logByDateController(
        req as LogByDateRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedCustomError);
    });
  });

  describe("When it's invoked with a logManager and it receives a request without a date in params and a response and next function", () => {
    test("Then it should invoke next function with error 'Log not available'", () => {
      const mockLockManager = new LogManagerMock("fakeRootFolderName");
      const logByDateController = getLogByDateController(mockLockManager);
      const req: Partial<LogByDateRequest> = {};

      logByDateController(
        req as LogByDateRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(logsErrors.noDate);
    });
  });
});
