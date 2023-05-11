import type { NextFunction, Request, Response } from "express";
import type { UserCredentials } from "../../../types.js";
import Log from "../Log/Log.js";
import LogManager from "../LogManager/LogManager.js";
import { LoginAttemptStatus } from "../types.js";

const logLoginAttempt = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const log = new Log(email, res.statusCode);
  const timeToString = log.time.toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
  });
  const statusToString = LoginAttemptStatus[log.status];
  const userLoginSession = `[${timeToString}] User: ${log.email}, session status: ${statusToString};\n`;

  const folderName = "sessions";
  const fileName = "sessions";
  const loginSessionManager = new LogManager(fileName, folderName);

  res.on("close", () => {
    (async () => {
      try {
        await loginSessionManager.writeLogToFile(userLoginSession);
      } catch (error: unknown) {
        next(error);
      }
    })();
  });

  next();
};

export default logLoginAttempt;
