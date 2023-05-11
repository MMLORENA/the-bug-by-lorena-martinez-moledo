import type { NextFunction } from "express";
import type { SetPasswordRequest } from "../../types";
import User from "../../../database/models/User";
import {
  activateErrors,
  loginErrors,
} from "../../../constants/errors/userErrors";

const checkActivationKey = async (
  req: SetPasswordRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, activationKey } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw loginErrors.userNotFound;
    }

    if (!user.activationKey || user.activationKey !== activationKey) {
      throw activateErrors.invalidActivationKey;
    }

    req.userDetails = { id: user._id.toString() };

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default checkActivationKey;
