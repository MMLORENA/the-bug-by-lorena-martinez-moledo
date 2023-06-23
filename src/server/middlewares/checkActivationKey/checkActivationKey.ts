import type { NextFunction, Response } from "express";
import User from "../../../database/models/User.js";
import {
  activateErrors,
  loginErrors,
} from "../../../constants/errors/userErrors.js";
import type { ActivationKeyRequest } from "../../types";
import HasherBcrypt from "../../../utils/HasherBcrypt/HasherBcrypt.js";

const checkActivationKey = async (
  req: ActivationKeyRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, activationKey: userId } = req.query;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw loginErrors.userNotFound;
    }

    const hasher = new HasherBcrypt();

    const today = new Date();

    if (
      !user.activationKey ||
      !(await hasher.compare(userId as string, user.activationKey)) ||
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
