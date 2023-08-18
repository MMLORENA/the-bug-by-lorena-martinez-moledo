import CustomError from "../../CustomError/CustomError.js";
import httpStatusCodes from "../statusCodes/httpStatusCodes.js";

const {
  clientErrors: { notFoundCode },
} = httpStatusCodes;

const generalErrors = {
  unknownEndpoint(path: string) {
    const unknownEndpointMessage = "Unknown endpoint";

    return new CustomError(
      `${unknownEndpointMessage}: ${path}`,
      notFoundCode,
      unknownEndpointMessage
    );
  },
};

export default generalErrors;
