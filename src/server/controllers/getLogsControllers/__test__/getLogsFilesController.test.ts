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
  const next = jest.fn();
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it is called and receives a response", () => {
    test("Then it should invoke response's method status with 200 and json with a collection of the names of the log files existing in the last 30 days", () => {
      const mockLogManager: LogManagerStructure = new LogManagerMock(
        "fakeFolderName"
      );
      const logFiles = ["01011970"];

      const userDetails = {
        id: "1234",
      };
      const req: Partial<CustomRequest> = {
        userDetails,
      };

      const logsFilesController = getLogsFilesController(mockLogManager);
      logsFilesController(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({
        logFiles,
      });
    });

    test("Then it should invoke next function when the method getNameFilesFromLastNDays throw an error with message 'Path is not a string'", () => {
      const mockError = new Error("Path is not a string");
      const mockLogManager: LogManagerStructure = new LogManagerMock(
        "fakeFolderName"
      );
      mockLogManager.getNameFilesFromLastNDays = jest.fn(() => {
        throw mockError;
      });

      const userDetails = {
        id: "1234",
      };
      const req: Partial<CustomRequest> = {
        userDetails,
      };

      const logsFilesController = getLogsFilesController(mockLogManager);
      logsFilesController(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
