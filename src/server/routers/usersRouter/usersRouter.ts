import cookieParser from "cookie-parser";
import { Router } from "express";
import { validate } from "express-validation";
import { environment } from "../../../environment/loadEnvironments.js";
import {
  activateUser,
  getUserData,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  sendEmailForForgottenPassword,
  setUserNewPassword,
} from "../../controllers/userControllers/userControllers.js";
import LogManager from "../../logs/LogManager/LogManager.js";
import getLogLoginAttempt from "../../logs/getLogLoginAttempt/getLogLoginAttempt.js";
import { auth } from "../../middlewares/auth/auth.js";
import checkActivationKey from "../../middlewares/checkActivationKey/checkActivationKey.js";
import activateUserSchema from "../../schemas/activateUserSchema.js";
import loginUserSchema from "../../schemas/loginUserSchema.js";
import registerUserSchema from "../../schemas/registerUserSchema.js";
import setNewPasswordSchema from "../../schemas/setNewPasswordSchema.js";
import { noAbortEarly } from "../../schemas/validateOptions.js";
import { partialPaths } from "../paths.js";

const usersRouter = Router();
const { logsRootFolder } = environment;
const logManager = new LogManager(logsRootFolder);

usersRouter.post(
  partialPaths.users.register,
  validate(registerUserSchema, {}, noAbortEarly),
  registerUser
);

usersRouter.post(
  partialPaths.users.login,
  validate(loginUserSchema, {}, noAbortEarly),
  getLogLoginAttempt(logManager),
  loginUser
);

usersRouter.post(
  partialPaths.users.activate,
  validate(activateUserSchema, {}, noAbortEarly),
  checkActivationKey,
  activateUser
);

usersRouter.post(
  partialPaths.users.setNewPassword,
  validate(setNewPasswordSchema, {}, noAbortEarly),
  checkActivationKey,
  setUserNewPassword
);

usersRouter.post(
  partialPaths.users.forgottenPassword,
  sendEmailForForgottenPassword
);

usersRouter.use(cookieParser());

usersRouter.get(partialPaths.users.verifyToken, auth, getUserDetails);

usersRouter.post(partialPaths.users.logout, auth, logoutUser);

usersRouter.get(partialPaths.users.userData, auth, getUserData);

export default usersRouter;
