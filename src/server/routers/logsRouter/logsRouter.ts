import { Router } from "express";
import { partialPaths } from "../paths.js";
import getLogsFilesController from "../../controllers/logsControllers/getLogsFilesController/getLogsFilesController.js";
import LogManager from "../../logs/LogManager/LogManager.js";
import auth from "../../middlewares/auth/auth.js";
import cookieParser from "cookie-parser";

// eslint-disable-next-line new-cap
const logsRouter = Router();
const logManager = new LogManager("sessions");

logsRouter.use(cookieParser());

logsRouter.get(
  partialPaths.logs.getLogsFiles,
  auth,
  getLogsFilesController(logManager)
);

export default logsRouter;
