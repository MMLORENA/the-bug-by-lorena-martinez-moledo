import type { NextFunction, Request, RequestHandler, Response } from "express";
import authErrors from "../../../constants/errors/authErrors.js";
import logsErrors from "../../../constants/errors/logsErrors.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import User from "../../../database/models/User.js";
import type LogManagerStructure from "../../logs/LogManager/types.js";
import type { CustomRequest } from "../../types.js";

const {
  successCodes: { okCode },
} = httpStatusCodes;

export const getLogsFilesController =
  (logManager: LogManagerStructure) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id: userId } = req.userDetails;

    try {
      const user = await User.findById(userId).exec();

      if (!user?.isAdmin) {
        throw authErrors.userIsNotAdmin;
      }

      const logNamesFiles = logManager.getFilenamesFromLastNDays(30);

      res.status(okCode).json({ logFiles: logNamesFiles });
    } catch (error: unknown) {
      next(error);
    }
  };

export const getLogByDateController =
  (logManager: LogManagerStructure): RequestHandler =>
  (
    req: Request<
      { date: string },
      Record<string, unknown>,
      Record<string, unknown>
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.params) {
        throw logsErrors.noDate;
      }

      const { date: dateToString } = req.params;

      const date = new Date(dateToString);
      const filePath = logManager.generatePathByDate(date);

      const log = logManager.readLogFromFile(filePath);

      res.status(okCode).json({ log });
    } catch (error: unknown) {
      let customError = error;

      if ((error as Error).message.includes("ENOENT")) {
        customError = logsErrors.noLogAvailable((error as Error).message);
      }

      next(customError);
    }
  };
