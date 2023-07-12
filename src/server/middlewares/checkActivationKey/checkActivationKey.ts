import type { NextFunction, Response } from "express";
import User from "../../../database/models/User.js";
import {
  activateErrors,
  loginErrors,
} from "../../../constants/errors/userErrors.js";
import type { ActivationKeyRequest } from "../../types";

const checkActivationKey = async (
  req: ActivationKeyRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, activationKey } = req.query;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw loginErrors.userNotFound;
    }

    const today = new Date();

    if (
      !user.activationKey ||
      activationKey !== user.activationKey ||
      today >= user.activationKeyExpiry!
    ) {
      throw activateErrors.invalidActivationKey;
    }

    req.userDetails = { id: user._id.toString() };

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default checkActivationKey;
