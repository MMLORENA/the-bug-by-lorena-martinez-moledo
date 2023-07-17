import { Router } from "express";
import { partialPaths } from "../paths";
import getLogsFilesController from "../../controllers/logsControllers/getLogsFilesController/getLogsFilesController";
import LogManager from "../../logs/LogManager/LogManager";
import auth from "../../middlewares/auth/auth";

// eslint-disable-next-line new-cap
const logsRouter = Router();

const logManager = new LogManager("sessions");

logsRouter.get(
  partialPaths.logs.getLogsFiles,
  auth,
  getLogsFilesController(logManager)
);

export default logsRouter;
