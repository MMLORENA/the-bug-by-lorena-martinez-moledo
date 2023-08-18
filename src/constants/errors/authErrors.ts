import CustomError from "../../CustomError/CustomError.js";
import httpStatusCodes from "../statusCodes/httpStatusCodes.js";

const {
  clientErrors: { unauthorizedCode, forbiddenCode },
} = httpStatusCodes;

const authErrors = {
  noToken: new CustomError(
    "No Token provided",
    unauthorizedCode,
    "No Token provided"
  ),

  generalAuthError(message: string) {
    const unauthorizedMessage = "Unauthorized";

    return new CustomError(message, unauthorizedCode, unauthorizedMessage);
  },
  userIsNotAdmin: new CustomError("User not Admin", forbiddenCode, "Forbidden"),
};

export default authErrors;
