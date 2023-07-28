import type { ValidationError, errors } from "express-validation";
import type CustomError from "../../../../CustomError/CustomError.js";

const getValidationErrors = (
  error: CustomError,
  detailsError: keyof errors
): string | undefined =>
  (error as ValidationError).details[detailsError]
    ?.map((joiError) => joiError.message.replaceAll(`"`, ""))
    .join(" & ");

export default getValidationErrors;
