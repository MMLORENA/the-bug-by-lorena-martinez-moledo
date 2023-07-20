import dotenv from "dotenv";
import envSchema from "./schema.js";

dotenv.config();

const envValidationResult = envSchema.validate(process.env);

if (envValidationResult.error) {
  console.error("\u001b[31mMissing environmental variables\u001b[0m");
  console.error(`\u001b[31m${envValidationResult.error.message}\u001b[0m`);
  process.exit(1);
}

const {
  ACTIVATION_KEY_EXPIRY: activationKeyExpiry,
  API_GATEWAY_KEY: apiGatewayKey,
  APP_NAME: appName,
  AUTH_FRONT_URL: authFrontUrl,
  EMAIL_SENDER: emailSender,
  JWT_SECRET: jwtSecret,
  MONGODB_DEBUG: mongoDbDebug,
  MONGODB_URL: mongoDbUrl,
  PORT: port,
  SMTP_HOST: smtpHost,
  SMTP_PASSWORD: smtpPassword,
  SMTP_PORT: smtpPort,
  SMTP_USERNAME: smtpUsername,
  SWAGGER_BASIC_AUTH_PASSWORD: swaggerBasicAuthPassword,
  SWAGGER_BASIC_AUTH_USERNAME: swaggerBasicAuthUsername,
  TOKEN_EXPIRY: tokenExpiry,
  LOGS_ROOT_FOLDER: logsRootFolder,
} = process.env;

export const environment = {
  port: port ? +port : 4000,
  mongoDbUrl: mongoDbUrl!,
  mongoDbDebug: mongoDbDebug === "true",
  jwt: {
    jwtSecret: jwtSecret!,
    tokenExpiry: +tokenExpiry!,
  },
  swaggerAuth: {
    username: swaggerBasicAuthUsername!,
    password: swaggerBasicAuthPassword!,
  },
  smtp: {
    host: smtpHost,
    username: smtpUsername,
    password: smtpPassword,
    port: +smtpPort!,
    emailSender,
  },
  appName: appName!,
  apiGatewayKey,
  activationKeyExpiry: +activationKeyExpiry!,
  authFrontUrl: authFrontUrl!,
  logsRootFolder: logsRootFolder!,
};
