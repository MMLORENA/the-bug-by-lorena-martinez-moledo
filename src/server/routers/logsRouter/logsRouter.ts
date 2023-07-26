import cookieParser from "cookie-parser";
import { Router } from "express";
import { getLogsFilesController } from "../../controllers/getLogsControllers/getLogsControllers.js";
import LogManager from "../../logs/LogManager/LogManager.js";
import { auth, checkIsUserAdmin } from "../../middlewares/auth/auth.js";
import { partialPaths } from "../paths.js";

const logsRouter = Router();
const logManager = new LogManager("sessions");

logsRouter.use(cookieParser());

logsRouter.get(
  partialPaths.logs.getLogsFiles,
  auth,
  checkIsUserAdmin,
  getLogsFilesController(logManager)
);

export default logsRouter;
