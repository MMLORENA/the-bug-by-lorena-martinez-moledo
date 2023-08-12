import { Joi } from "express-validation";
import joiTypesError from "./joiTypesErrors.js";

const { stringEmpty, stringPatternName } = joiTypesError;

const getLogByDateSchema = {
  query: Joi.object({
    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD")
      .required()
      .messages({
        [stringPatternName]: "Invalid date format. Format must be YYYY-MM-DD",
        [stringEmpty]: "Date params is required",
      }),
  }),
};

export default getLogByDateSchema;
