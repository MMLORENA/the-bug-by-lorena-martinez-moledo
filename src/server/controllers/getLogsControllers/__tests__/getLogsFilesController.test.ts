import type { Response } from "express";
import LogManagerMock from "../../../../__mocks__/LogManagerMock";
import authErrors from "../../../../constants/errors/authErrors";
import httpStatusCodes from "../../../../constants/statusCodes/httpStatusCodes";
import User from "../../../../database/models/User";
import { getMockUser } from "../../../../factories/userFactory";
import type LogManagerStructure from "../../../logs/LogManager/types";
import type { CustomRequest } from "../../../types";
import { getLogsFilesController } from "../getLogsControllers";

describe("Given a getLogs controller", () => {
  const next = jest.fn();
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const mockLogManager: LogManagerStructure = new LogManagerMock(
    "fakeFolderName"
  );
  const logFiles = ["01011970"];

  describe("When it is called and the returning controller receives a CustomRequest with user details id: '1234' that belongs to a user who is an administrator", () => {
    test("Then it should invoke response's method status with 200 and json with a collection of the names of the log files existing in the last 30 days", async () => {
      const userDetails = {
        id: "1234",
      };
      const {
        successCodes: { okCode },
      } = httpStatusCodes;
      const req: Partial<CustomRequest> = {
        userDetails,
      };

      User.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(getMockUser({ isAdmin: true })),
      });
      const logsFilesController = getLogsFilesController(mockLogManager);
      await logsFilesController(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(okCode);
      expect(res.json).toHaveBeenCalledWith({
        logFiles,
      });
    });
  });

  describe("When it is called and the returning controller receives a CustomRequest with user details id: '4321' which does NOT belong to a user who is an administrator.", () => {
    test("Then it should call next function with 'User does not have administrator permissions'", async () => {
      const userDetails = {
        id: "4321",
      };
      const req: Partial<CustomRequest> = {
        userDetails,
      };

      User.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(getMockUser({ isAdmin: false })),
      });

      const logsFilesController = getLogsFilesController(mockLogManager);
      await logsFilesController(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(authErrors.userIsNotAdmin);
    });
  });
});
