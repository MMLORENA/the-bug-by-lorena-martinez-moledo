import CustomError from "../../CustomError/CustomError.js";
import httpStatusCodes from "../statusCodes/httpStatusCodes.js";

const {
  clientErrors: { notFoundCode },
} = httpStatusCodes;

const generalErrors = {
  unknownEndpoint: (path: string) =>
    new CustomError(
      `Unknown endpoint: ${path}`,
      notFoundCode,
      "Unknown endpoint"
    ),
};

export default generalErrors;
