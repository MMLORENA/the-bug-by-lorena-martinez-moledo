import chalk from "chalk";
import type { NextFunction, Request, Response } from "express";
import type { errors } from "express-validation";
import { ValidationError } from "express-validation";
import type CustomError from "../../../CustomError/CustomError.js";
import generalErrors from "../../../constants/errors/generalErrors.js";
import httpStatusCodes from "../../../constants/statusCodes/httpStatusCodes.js";
import "../../../environment/loadEnvironments.js";
import debugConfig from "../../../utils/debugConfig/debugConfig.js";
import getValidationErrors from "../../../utils/getValidationErrors/getValidationErrors.js";

const {
  serverErrors: { internalServerErrorCode },
} = httpStatusCodes;

const debug = debugConfig.extend("middlewares:errors");

const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ValidationError && error.details) {
    const detailsErrorKeys = Object.keys(error.details);

    for (const key of detailsErrorKeys) {
      const validationErrors = getValidationErrors(error, key as keyof errors);

      (error as CustomError).publicMessage = validationErrors;

      debug(chalk.blueBright(validationErrors));
    }
  }

  const statusCode = error.statusCode || internalServerErrorCode;
  const publicMessage =
    error.publicMessage ?? "There was an error on the server";

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
