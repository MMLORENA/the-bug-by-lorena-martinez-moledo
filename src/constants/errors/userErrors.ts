import CustomError from "../../CustomError/CustomError.js";
import httpStatusCodes from "../statusCodes/httpStatusCodes.js";

const {
  clientErrors: { unauthorizedCode, conflictCode, notFoundCode },
  serverErrors: { internalServerErrorCode },
} = httpStatusCodes;

export const unauthorizedMessage = "Incorrect email or password";
export const invalidActivationKeyMessage = "Invalid activation key";
export const expiredActivationKeyMessage = "Expired activation key";
export const noActivationKeyMessage = "No activation key";
export const notActivatedUserMessage = "User can not be activated";

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
  userIsNotAdmin: new CustomError(
    "User does not have administrator permissions",
    unauthorizedCode,
    "User does not have administrator permissions"
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
  noActivationKey: new CustomError(
    noActivationKeyMessage,
    unauthorizedCode,
    notActivatedUserMessage
  ),

  invalidActivationKey: new CustomError(
    invalidActivationKeyMessage,
    unauthorizedCode,
    notActivatedUserMessage
  ),

  expiredActivationKey: new CustomError(
    expiredActivationKeyMessage,
    unauthorizedCode,
    notActivatedUserMessage
  ),
};

export const userDataErrors = {
  userDataNotFound: new CustomError(
    "User data not available",
    notFoundCode,
    "User data not available"
  ),
};
