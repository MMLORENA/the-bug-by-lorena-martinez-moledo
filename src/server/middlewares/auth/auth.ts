import jwt from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import type { CustomRequest, CustomTokenPayload } from "../../types";
import config from "../../../config.js";
import { environment } from "../../../loadEnvironments.js";
import authErrors from "../../../constants/errors/authErrors.js";

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

    const verifyToken: CustomTokenPayload = jwt.verify(
      authToken,
      jwtSecret
    ) as CustomTokenPayload;

    if (verifyToken.name.includes("Error")) {
      throw authErrors.generalAuthError(verifyToken.message);
    }

    const { name, isAdmin, id } = verifyToken;

    req.userDetails = { name, isAdmin, id };

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
