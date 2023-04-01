import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../../../config.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import User from "../../../database/models/User.js";
import createRegisterEmail from "../../../email/emailTemplates/createRegisterEmail.js";
import sendEmail from "../../../email/sendEmail/sendEmail.js";
import { environment } from "../../../loadEnvironments.js";
import PasswordHasherBcrypt from "../../../utils/PasswordHasherBcrypt/PasswordHasherBcrypt.js";
import type {
  CustomRequest,
  CustomTokenPayload,
  UserActivationCredentials,
  UserCredentials,
  UserData,
} from "../../types.js";
import {
  activateErrors,
  loginErrors,
  registerErrors,
} from "../../../constants/errors/userErrors.js";
import { userDataErrors } from "../../../constants/errors/userErrors.js";

const {
  jwt: { jwtSecret, tokenExpiry },
} = environment;

const {
  successCodes: { createdCode, okCode, noContentSuccessCode },
} = httpStatusCodes;

const {
  singleSignOnCookie: { cookieName, cookieMaxAge },
} = config;

const passwordHasher = new PasswordHasherBcrypt();

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

    const activationKey = await passwordHasher.passwordHash(userId);

    newUser.activationKey = activationKey;

    await newUser.save();

    const { text, subject } = createRegisterEmail(name, userId);

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
    const user = await User.findOne({ email });

    if (!user) {
      throw loginErrors.userNotFound;
    }

    if (!(await passwordHasher.passwordCompare(password, user.password))) {
      throw loginErrors.incorrectPassword;
    }

    if (!user.isActive) {
      throw loginErrors.inactiveUser;
    }

    const tokenPayload: CustomTokenPayload = {
      name: user.name,
      isAdmin: user.isAdmin,
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
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserActivationCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { activationKey: userId } = req.query;

  const { password } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      throw activateErrors.invalidActivationKey;
    }

    const user = await User.findById(userId);

    if (!user) {
      throw activateErrors.invalidActivationKey;
    }

    if (
      !user.activationKey ||
      !(await passwordHasher.passwordCompare(
        userId as string,
        user.activationKey
      ))
    ) {
      throw activateErrors.invalidActivationKey;
    }

    const hashedPassword = await passwordHasher.passwordHash(password);

    user.password = hashedPassword;
    user.isActive = true;

    await user.save();

    res.status(okCode).json({ message: "User account has been activated" });
  } catch (error: unknown) {
    next(error);
  }
};

export const getUserDetails = (req: CustomRequest, res: Response) => {
  const { id, isAdmin, name } = req.userDetails;

  res.status(okCode).json({ userPayload: { name, isAdmin, id } });
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
