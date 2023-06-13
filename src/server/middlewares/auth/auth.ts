import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../../config.js";
import authErrors from "../../../constants/errors/authErrors.js";
import { environment } from "../../../environment/loadEnvironments.js";
import type { CustomRequest, CustomTokenPayload } from "../../types";

const {
  jwt: { jwtSecret },
} = environment;

const {
  singleSignOnCookie: { cookieName },
} = config;

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
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

export default auth;
