import type { NextFunction, Request, RequestHandler, Response } from "express";
import logsErrors from "../../../constants/errors/logsErrors.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import type LogManagerStructure from "../LogManager/types";

const {
  successCodes: { okCode },
} = httpStatusCodes;

const getLogByDateController =
  (logManager: LogManagerStructure): RequestHandler =>
  (
    req: Request<
      { dateToString: string },
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

      const { dateToString } = req.params;

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

export default getLogByDateController;
