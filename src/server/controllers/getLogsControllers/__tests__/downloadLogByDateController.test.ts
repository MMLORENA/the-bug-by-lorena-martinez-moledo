import type { NextFunction, Response } from "express";
import { downloadLogByDateController } from "../logsControllers";
import type { LogByDateRequest } from "../../../types";
import LogManagerMock from "../../../../__mocks__/LogManagerMock";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";

const {
  successCodes: { okCode },
} = httpStatusCodes;

describe("Given a downloadByDateController", () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    attachment: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    sendFile: jest.fn(),
  };
  const next = jest.fn();

  describe("When it's invoked with a logManager and it receives a request with date in query params '01-01-1970' and a response", () => {
    const req: Partial<LogByDateRequest> = {
      query: {
        date: "01-01-1970",
      },
    };

    test("Then it should invoke response's method status with 200, attachment with 'fakeRootFolderName/1970/01/01011970' and sendfile with the same path", () => {
      const fakeRootFolderName = "fakeRootFolderName";
      const expectedPath = "fakeRootFolderName/1970/01/01011970";

      const mockLockManager = new LogManagerMock(fakeRootFolderName);

      const downloadController = downloadLogByDateController(mockLockManager);

      downloadController(
        req as LogByDateRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.attachment).toHaveBeenCalledWith(expectedPath);
      expect(res.sendFile).toHaveBeenCalledWith(
        expectedPath,
        expect.anything(),
        expect.anything()
      );
    });
  });
});
