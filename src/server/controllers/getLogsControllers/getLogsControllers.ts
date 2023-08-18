import type { NextFunction, Response } from "express";
import path from "node:path";
import logsErrors from "../../../constants/errors/logsErrors.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import __dirname from "../../../utils/dirname.js";
import type LogManagerStructure from "../../logs/LogManager/types.js";
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
  (logManager: LogManagerStructure) =>
  (req: LogByDateRequest, res: Response, next: NextFunction) => {
    try {
      const { date: formattedDate } = req.query;

      const date = new Date(formattedDate);
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

export const getDownloadLogByDateController =
  (logManager: LogManagerStructure) =>
  (req: LogByDateRequest, res: Response, next: NextFunction) => {
    try {
      const { date: formattedDate } = req.query;

      const date = new Date(formattedDate);
      const filePath = logManager.generatePathByDate(date);

      res
        .status(200)
        .attachment(filePath)
        .sendFile(
          filePath,
          {
            root: path.join(__dirname, "../../../../"),
          },
          (error) => {
            if (!error) {
              return;
            }

            let customError = error;

            if (error.message.includes("ENOENT")) {
              customError = logsErrors.noLogAvailable(error.message);
            }

            throw customError;
          }
        );
    } catch (error: unknown) {
      next(error);
    }
  };
