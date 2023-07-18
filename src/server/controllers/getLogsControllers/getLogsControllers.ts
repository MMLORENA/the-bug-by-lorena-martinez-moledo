import type { NextFunction, Response } from "express";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import type LogManagerStructure from "../../logs/LogManager/types.js";
import type { CustomRequest } from "../../types.js";

const {
  successCodes: { okCode },
} = httpStatusCodes;

export const getLogsFilesController =
  (logManager: LogManagerStructure) =>
  (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const lastThirteenDays = 30;
      const logNamesFiles =
        logManager.getNameFilesFromLastNDays(lastThirteenDays);

      res.status(okCode).json({ logFiles: logNamesFiles });
    } catch (error: unknown) {
      next(error);
    }
  };
