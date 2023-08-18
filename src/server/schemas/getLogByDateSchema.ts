import { Joi } from "express-validation";
import joiTypesError from "./joiTypesErrors.js";

const { stringEmpty, stringPatternName } = joiTypesError;

const getLogByDateSchema = {
  query: Joi.object({
    date: Joi.string()
      .pattern(/^\d{2}-\d{2}-\d{4}$/, "DD-MM-YYYY")
      .required()
      .messages({
        [stringPatternName]: "Invalid date format. Format must be DD-MM-YYYY",
        [stringEmpty]: "Date query params is required",
      }),
  }),
};

export default getLogByDateSchema;
