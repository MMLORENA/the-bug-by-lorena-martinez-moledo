import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../../config.js";
import {
  loginErrors,
  registerErrors,
  userDataErrors,
} from "../../../constants/errors/userErrors.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import User from "../../../database/models/User.js";
import createRegisterEmail from "../../../email/emailTemplates/createRegisterEmail.js";
import sendEmail from "../../../email/sendEmail/sendEmail.js";
import { environment } from "../../../environment/loadEnvironments.js";
import HasherBcrypt from "../../../utils/HasherBcrypt/HasherBcrypt.js";
import type {
  CustomRequest,
  CustomTokenPayload,
  UserCredentials,
  UserData,
  UserEmail,
} from "../../types.js";
import CustomError from "../../../CustomError/CustomError.js";
import createForgottenPasswordEmail from "../../../email/emailTemplates/createForgottenPasswordEmail.js";

const {
  jwt: { jwtSecret, tokenExpiry },
} = environment;

const {
  successCodes: { createdCode, okCode, noContentSuccessCode },
} = httpStatusCodes;

const {
  singleSignOnCookie: { cookieName, cookieMaxAge },
} = config;

const hasher = new HasherBcrypt();

export const registerUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserData>,
  res: Response,
  next: NextFunction
) => {
  const { name, email } = req.body;

  try {
    const newUser = await User.create({
      name,
      email,
    });

    const userId = newUser._id.toString();

    const activationKey = await hasher.hash(userId);

    newUser.activationKey = activationKey;

    const activationKeyExpiry = new Date(
      new Date().getTime() + environment.activationKeyExpiry
    );

    newUser.activationKeyExpiry = activationKeyExpiry;

    await newUser.save();

    const { text, subject } = createRegisterEmail(
      name,
      activationKey,
      activationKeyExpiry.getTime()
    );

    await sendEmail({
      to: email,
      text,
      subject,
    });

    res.status(createdCode).json({ user: { id: newUser._id, name, email } });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;

    if (errorMessage.includes("duplicate key")) {
      next(registerErrors.duplicateUser(errorMessage));
      return;
    }

    next(registerErrors.generalRegisterError(errorMessage));
  }
};

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw loginErrors.userNotFound;
    }

    if (!user.password) {
      throw loginErrors.incorrectPassword;
    }

    if (!(await hasher.compare(password, user.password))) {
      throw loginErrors.incorrectPassword;
    }

    if (!user.isActive) {
      throw loginErrors.inactiveUser;
    }

    const tokenPayload: CustomTokenPayload = {
      id: user._id.toString(),
    };

    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: tokenExpiry });

    res
      .status(okCode)
      .cookie(cookieName, token, {
        httpOnly: true,
        maxAge: cookieMaxAge,
        sameSite: "none",
        secure: true,
      })
      .json({ message: `${cookieName} has been set` });
  } catch (error: unknown) {
    next(error);
  }
};

export const activateUser = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    Pick<UserCredentials, "password">
  >,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.query;

  const { password } = req.body;

  try {
    const user = (await User.findOne({ email }).exec())!;

    const hashedPassword = await hasher.hash(password);

    user.password = hashedPassword;
    user.isActive = true;

    await user.save();

    res.status(okCode).json({ message: "User account has been activated" });
  } catch (error: unknown) {
    next(error);
  }
};

export const getUserDetails = (req: CustomRequest, res: Response) => {
  const { id } = req.userDetails;

  res.status(okCode).json({ userPayload: { id } });
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie(cookieName).sendStatus(noContentSuccessCode);
};

export const getUserData = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.userDetails;

  try {
    const user = await User.findById(userId).exec();

    if (!user) {
      throw userDataErrors.userDataNotFound;
    }

    res.status(okCode).json({
      user: { name: user.name, isAdmin: user.isAdmin, email: user.email },
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const setUserNewPassword = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    Pick<UserCredentials, "password">
  >,
  res: Response,
  next: NextFunction
) => {
  const {
    userDetails: { id: userId },
    body: { password: newPassword },
  } = req;

  try {
    const user = await User.findById(userId).exec();

    if (!user) {
      throw userDataErrors.userDataNotFound;
    }

    if (!user.isActive && !user.password) {
      user.isActive = true;
    }

    const hashedPassword = await hasher.hash(newPassword);
    user.password = hashedPassword;

    await user.save();

    res.status(okCode).json({ message: "User's new password has been set" });
  } catch (error: unknown) {
    next(error);
  }
};

export const sendEmailForForgottenPassword = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserEmail>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const activationKey = await hasher.hash(user._id.toString());

    user.activationKey = activationKey;

    const activationKeyExpiry = new Date(
      new Date().getTime() + environment.activationKeyExpiry
    );

    user.activationKeyExpiry = activationKeyExpiry;

    await user.save();

    const { text, subject } = createForgottenPasswordEmail(
      user.name,
      user._id.toString(),
      activationKeyExpiry.getTime()
    );

    await sendEmail({
      to: email,
      text,
      subject,
    });

    res.status(okCode).json({ message: "Email sent" });
  } catch (error: unknown) {
    next(error);
  }
};
