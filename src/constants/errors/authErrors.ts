import CustomError from "../../CustomError/CustomError.js";
import httpStatusCodes from "../statusCodes/httpStatusCodes.js";

const {
  clientErrors: { unauthorizedCode },
} = httpStatusCodes;

const authErrors = {
  noToken: new CustomError(
    "No Token provided",
    unauthorizedCode,
    "No Token provided"
  ),

  generalAuthError(message?: string) {
    const unauthorizedMessage = "Unauthorized";

    return new CustomError(
      message ?? unauthorizedMessage,
      unauthorizedCode,
      unauthorizedMessage
    );
  },
};

export default authErrors;
