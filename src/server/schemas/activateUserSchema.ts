import { Joi } from "express-validation";
import type { UserActivationCredentials } from "../types.js";
import joiTypesError from "./joiTypesErrors.js";
import {
  activationKeySchema,
  activationPasswordSchema,
  emailSchema,
} from "./userCredentialSchemas.js";

const { anyOnly } = joiTypesError;

const activateUserSchema = {
  body: Joi.object<UserActivationCredentials>({
    password: activationPasswordSchema,
    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ [anyOnly]: "Passwords must match" }),
  }),
  query: Joi.object({
    email: emailSchema,
    activationKey: activationKeySchema,
  }),
};

export default activateUserSchema;
