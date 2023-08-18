import type { NextFunction, RequestHandler, Response } from "express";
import logsErrors from "../../../constants/errors/logsErrors.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import type LogManagerStructure from "../../logs/LogManager/types.js";
import type { LogFile } from "../../logs/types.js";
import type { CustomRequest, LogByDateRequest } from "../../types.js";

const {
  successCodes: { okCode },
} = httpStatusCodes;

export const getLogsFilesController =
  (logManager: LogManagerStructure) =>
  (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const lastNumberOfDays = 30;
      const logNamesFiles =
        logManager.getFilenamesFromLastNumberOfDays(lastNumberOfDays);

      res.status(okCode).json({ logFiles: logNamesFiles });
    } catch (error: unknown) {
      next(error);
    }
  };

export const getLogByDateController =
  (logManager: LogManagerStructure): RequestHandler =>
  (req: LogByDateRequest, res: Response, next: NextFunction) => {
    try {
      const { date: dateString } = req.params;
      const [day, month, year] = dateString.split("-");

      const date = new Date(+year, +month - 1, +day);
      const filePath = logManager.generatePathByDate(date);

      const logDetails = logManager.readLogFromFile(filePath);
      const logFile: LogFile = {
        name: `${day}${month}${year}`,
        details: logDetails,
      };

      res.status(okCode).json({
        logFile,
      });
    } catch (error: unknown) {
      let customError = error;

      if ((error as Error).message.includes("ENOENT")) {
        customError = logsErrors.noLogAvailable((error as Error).message);
      }

      next(customError);
    }
  };
