import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../../config.js";
import authErrors from "../../../constants/errors/authErrors.js";
import User from "../../../database/models/User.js";
import { environment } from "../../../environment/loadEnvironments.js";
import type { CustomRequest, CustomTokenPayload } from "../../types";

const {
  jwt: { jwtSecret },
} = environment;

const {
  singleSignOnCookie: { cookieName },
} = config;

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authToken = (req.cookies as Record<string, string>)[cookieName];

    if (!authToken) {
      throw authErrors.noToken;
    }

    const userPayload: CustomTokenPayload = jwt.verify(
      authToken,
      jwtSecret
    ) as CustomTokenPayload;

    const { id } = userPayload;

    req.userDetails = { id };

    next();
  } catch (error: unknown) {
    const { message } = error as Error;

    if (message === "jwt malformed") {
      next(authErrors.generalAuthError(message));
      return;
    }

    next(error);
  }
};

export const checkIsUserAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.userDetails;

  try {
    const user = await User.findById(userId).exec();

    if (!user?.isAdmin) {
      throw authErrors.userIsNotAdmin;
    }

    next();
  } catch (error: unknown) {
    next(error);
  }
};
