import type { Response } from "express";
import LogManagerMock from "../../../../__mocks__/LogManagerMock";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import type LogManagerStructure from "../../../logs/LogManager/types";
import type { CustomRequest } from "../../../types";
import { getLogsFilesController } from "../getLogsControllers";

const {
  successCodes: { okCode },
} = httpStatusCodes;

describe("Given a getLogs controller", () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const req: Partial<CustomRequest> = {};
  const next = jest.fn();
  const mockRootFolderName = "fakeFolderName";

  describe("When it is called and receives a response", () => {
    test("Then it should invoke response's method status with 200 and json with a collection of the names of the log files existing in the last 30 days", () => {
      const expectedLogFiles = ["01011970"];
      const mockLogManager: LogManagerStructure = new LogManagerMock(
        mockRootFolderName
      );

      const logsFilesController = getLogsFilesController(mockLogManager);
      logsFilesController(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({
        logFiles: expectedLogFiles,
      });
    });

    test("Then it should invoke next function with error 'Something went wrong' when the method getFilenamesFromLastNDays fails", () => {
      const mockLogManager: LogManagerStructure = new LogManagerMock(
        mockRootFolderName
      );
      const mockError = new Error("Something went wrong");
      mockLogManager.getFilenamesFromLastNDays = jest.fn(() => {
        throw mockError;
      });

      const logsFilesController = getLogsFilesController(mockLogManager);
      logsFilesController(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
