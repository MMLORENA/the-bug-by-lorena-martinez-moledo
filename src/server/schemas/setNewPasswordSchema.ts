import { Joi } from "express-validation";
import type { UserActivationCredentials } from "../types";
import {
  activationKeySchema,
  activationPasswordSchema,
  emailSchema,
} from "./userCredentialSchemas.js";
const setNewPasswordSchema = {
  body: Joi.object<UserActivationCredentials>({
    password: activationPasswordSchema,
  }),
  query: Joi.object({
    email: emailSchema,
    activationKey: activationKeySchema,
  }),
};

export default setNewPasswordSchema;
