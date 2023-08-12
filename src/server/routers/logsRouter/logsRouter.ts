import cookieParser from "cookie-parser";
import { Router } from "express";
import { validate } from "express-validation";
import { environment } from "../../../environment/loadEnvironments.js";
import {
  getDownloadLogByDateController,
  getLogByDateController,
  getLogsFilesController,
} from "../../controllers/getLogsControllers/getLogsControllers.js";
import LogManager from "../../logs/LogManager/LogManager.js";
import { auth, checkIsUserAdmin } from "../../middlewares/auth/auth.js";
import getLogByDateSchema from "../../schemas/getLogByDateSchema.js";
import { noAbortEarly } from "../../schemas/validateOptions.js";
import { partialPaths, paths } from "../paths.js";

const { logsRootFolder } = environment;

const logsRouter = Router();
const logManager = new LogManager(logsRootFolder);

logsRouter.use(cookieParser());

logsRouter.get(
  paths.root,
  auth,
  checkIsUserAdmin,
  getLogsFilesController(logManager)
);

logsRouter.get(
  partialPaths.logs.downloadLogByDate,
  validate(getLogByDateSchema, {}, noAbortEarly),
  auth,
  checkIsUserAdmin,
  getDownloadLogByDateController(logManager)
);

logsRouter.get(
  partialPaths.logs.logByDate,
  validate(getLogByDateSchema, {}, noAbortEarly),
  auth,
  checkIsUserAdmin,
  getLogByDateController(logManager)
);

export default logsRouter;
