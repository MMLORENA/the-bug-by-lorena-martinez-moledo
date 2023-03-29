import "../../../loadEnvironments.js";
import chalk from "chalk";
import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import type CustomError from "../../../CustomError/CustomError.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import debugConfig from "../../../utils/debugConfig/debugConfig.js";
import generalErrors from "../../../constants/errors/generalErrors.js";

const {
  serverErrors: { internalServerErrorCode },
} = httpStatusCodes;

const debug = debugConfig.extend("middlewares:errors");

const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    const validationErrors = error.details.body
      // eslint-disable-next-line no-useless-escape
      .map((joiError) => joiError.message.replaceAll(`\"`, ""))
      .join(" & ");

    error.publicMessage = validationErrors;

    debug(chalk.blueBright(validationErrors));
  }

  const statusCode = error.statusCode || internalServerErrorCode;
  const publicMessage =
    error.publicMessage || "There was an error on the server";

  debug(chalk.bold.red(error.message));

  res.status(statusCode).json({ error: publicMessage });
};

export const unknownEndpoint = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { path } = req;

  next(generalErrors.unknownEndpoint(path));
};

export default generalError;
