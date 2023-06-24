import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { UserCredentials } from "../../types";
import Log from "../Log/Log.js";
import type LogManagerStructure from "../LogManager/types";

const getLogLoginAttempt =
  (logManager: LogManagerStructure): RequestHandler =>
  (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      UserCredentials
    >,
    res: Response,
    next: NextFunction
  ) => {
    const { email } = req.body;
    res.on("close", () => {
      const userLoginSession = new Log(email, res.statusCode, {
        locales: "en-GB",
        options: { timeZone: "Europe/Madrid" },
      });

      (async () => {
        try {
          logManager.writeLogToFile(userLoginSession.createLog());
        } catch (error: unknown) {
          next(error);
        }
      })();
    });

    next();
  };

export default getLogLoginAttempt;
