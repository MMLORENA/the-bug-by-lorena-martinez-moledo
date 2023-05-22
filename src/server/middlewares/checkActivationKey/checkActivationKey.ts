import type { NextFunction, Response } from "express";
import User from "../../../database/models/User";
import {
  activateErrors,
  loginErrors,
} from "../../../constants/errors/userErrors";
import type { ActivationKeyRequest } from "../../types";
import HasherBcrypt from "../../../utils/HasherBcrypt/HasherBcrypt";

const checkActivationKey = async (
  req: ActivationKeyRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, activationKey } = req.params;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw loginErrors.userNotFound;
    }

    const hasher = new HasherBcrypt();

    const today = new Date();

    if (
      !user.activationKey ||
      !(await hasher.compare(activationKey, user.activationKey)) ||
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
