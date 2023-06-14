/* eslint-disable @typescript-eslint/naming-convention */
import Joi from "joi";

const envSchema = Joi.object({
  ACTIVATION_KEY_EXPIRY: Joi.string().required(),
  API_GATEWAY_KEY: Joi.string().required(),
  APP_NAME: Joi.string().required(),
  AUTH_FRONT_URL: Joi.string().required(),
  DEBUG: Joi.string().required(),
  EMAIL_SENDER: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  MONGODB_DEBUG: Joi.string().required(),
  MONGODB_URL: Joi.string().required(),
  PORT: Joi.string(),
  SMTP_HOST: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  SMTP_PORT: Joi.string().required(),
  SMTP_USERNAME: Joi.string().required(),
  SWAGGER_BASIC_AUTH_PASSWORD: Joi.string(),
  SWAGGER_BASIC_AUTH_USERNAME: Joi.string(),
  TOKEN_EXPIRY: Joi.string().required(),
}).unknown();

export default envSchema;
