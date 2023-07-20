import type { NextFunction, RequestHandler, Response } from "express";
import logsErrors from "../../../constants/errors/logsErrors.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import type LogManagerStructure from "../../logs/LogManager/types.js";
import type { CustomRequest, LogByDateRequest } from "../../types.js";

const {
  successCodes: { okCode },
} = httpStatusCodes;

export const getLogsFilesController =
  (logManager: LogManagerStructure) =>
  (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const lastThirteenDays = 30;
      const logNamesFiles =
        logManager.getFilenamesFromLastNDays(lastThirteenDays);

      res.status(okCode).json({ logFiles: logNamesFiles });
    } catch (error: unknown) {
      next(error);
    }
  };

export const getLogByDateController =
  (logManager: LogManagerStructure): RequestHandler =>
  (req: LogByDateRequest, res: Response, next: NextFunction) => {
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
