import CustomError from "../../CustomError/CustomError.js";
import httpStatusCodes from "../statusCodes/httpStatusCodes.js";

const {
  clientErrors: { unauthorizedCode, conflictCode, notFoundCode },
  serverErrors: { internalServerErrorCode },
} = httpStatusCodes;

export const unauthorizedMessage = "Incorrect email or password";
export const invalidActivationKeyMessage = "Invalid activation key";
export const expiredActivationKeyMessage = "Expired activation key";

export const loginErrors = {
  userNotFound: new CustomError(
    "User not found",
    unauthorizedCode,
    unauthorizedMessage
  ),

  incorrectPassword: new CustomError(
    "Incorrect password",
    unauthorizedCode,
    unauthorizedMessage
  ),

  inactiveUser: new CustomError(
    "User is inactive",
    unauthorizedCode,
    "User is inactive, contact your administrator if you think this is a mistake"
  ),
};

export const registerErrors = {
  duplicateUser(message: string) {
    const duplicateUserMessage = "User already exists";

    return new CustomError(
      message ?? duplicateUserMessage,
      conflictCode,
      duplicateUserMessage
    );
  },

  generalRegisterError(message?: string) {
    const generalRegisterErrorMessage = "Error creating a new user";

    return new CustomError(
      message ?? generalRegisterErrorMessage,
      internalServerErrorCode,
      generalRegisterErrorMessage
    );
  },
};

export const activateErrors = {
  invalidActivationKey: new CustomError(
    invalidActivationKeyMessage,
    unauthorizedCode,
    invalidActivationKeyMessage
  ),

  expiredActivationKey: new CustomError(
    expiredActivationKeyMessage,
    unauthorizedCode,
    expiredActivationKeyMessage
  ),
};

export const userDataErrors = {
  userDataNotFound: new CustomError(
    "User data not available",
    notFoundCode,
    "User data not available"
  ),
};
