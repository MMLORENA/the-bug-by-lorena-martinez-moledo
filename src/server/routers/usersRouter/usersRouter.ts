import cookieParser from "cookie-parser";
import { Router } from "express";
import { validate } from "express-validation";
import {
  activateUser,
  getUserData,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  sendEmailForForgottenPassword,
} from "../../controllers/userControllers/userControllers.js";
import auth from "../../middlewares/auth/auth.js";
import logLoginAttempt from "../../middlewares/logs/logLoginAttempt/logLoginAttempt.js";
import activateUserSchema from "../../schemas/activateUserSchema.js";
import loginUserSchema from "../../schemas/loginUserSchema.js";
import registerUserSchema from "../../schemas/registerUserSchema.js";
import { noAbortEarly } from "../../schemas/validateOptions.js";
import { partialPaths } from "../paths.js";

// eslint-disable-next-line new-cap
const usersRouter = Router();

usersRouter.post(
  partialPaths.users.register,
  validate(registerUserSchema, {}, noAbortEarly),
  registerUser
);

usersRouter.post(
  partialPaths.users.login,
  validate(loginUserSchema, {}, noAbortEarly),
  logLoginAttempt,
  loginUser
);

usersRouter.post(
  partialPaths.users.activate,
  validate(activateUserSchema, {}, noAbortEarly),
  activateUser
);

usersRouter.get(
  partialPaths.users.forgottenPassword,
  sendEmailForForgottenPassword
);

usersRouter.use(cookieParser());

usersRouter.get(partialPaths.users.verifyToken, auth, getUserDetails);

usersRouter.post(partialPaths.users.logout, auth, logoutUser);

usersRouter.get(partialPaths.users.userData, auth, getUserData);

export default usersRouter;
