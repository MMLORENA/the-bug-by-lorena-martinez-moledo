import CustomError from "../../CustomError/CustomError.js";
import httpStatusCodes from "../statusCodes/httpStatusCodes.js";

const {
  clientErrors: { badRequestCode, notFoundCode },
} = httpStatusCodes;

const logNotAvailable = "Log not available";

const logsErrors = {
  noDate: new CustomError(
    "Date not provided in params",
    badRequestCode,
    logNotAvailable
  ),
  noLogAvailable(message: string) {
    return new CustomError(message, notFoundCode, logNotAvailable);
  },
};

export default logsErrors;
