import dotenv from "dotenv";

dotenv.config();

const {
  PORT: port,
  MONGODB_URL: mongoDbUrl,
  MONGODB_DEBUG: mongoDbDebug,
  JWT_SECRET: jwtSecret,
  SWAGGER_BASIC_AUTH_USERNAME: swaggerBasicAuthUsername,
  SWAGGER_BASIC_AUTH_PASSWORD: swaggerBasicAuthPassword,
  SMTP_HOST: smtpHost,
  SMTP_PORT: smtpPort,
  SMTP_USERNAME: smtpUsername,
  SMTP_PASSWORD: smtpPassword,
  EMAIL_SENDER: emailSender,
  TOKEN_EXPIRY: tokenExpiry,
  ACTIVATION_KEY_EXPIRY: activationKeyExpiry,
  APP_NAME: appName,
  API_GATEWAY_KEY: apiGatewayKey,
} = process.env;

if (
  !port ||
  !tokenExpiry ||
  !smtpPort ||
  !mongoDbUrl ||
  !appName ||
  !jwtSecret ||
  !swaggerBasicAuthPassword ||
  !swaggerBasicAuthUsername
) {
  console.error("Missing environmental variables");
  process.exit(1);
}

export const environment = {
  port: +port || 4000,
  mongoDbUrl,
  mongoDbDebug: mongoDbDebug === "true",
  jwt: {
    jwtSecret,
    tokenExpiry: +tokenExpiry,
  },
  swaggerAuth: {
    username: swaggerBasicAuthUsername,
    password: swaggerBasicAuthPassword,
  },
  smtp: {
    host: smtpHost,
    username: smtpUsername,
    password: smtpPassword,
    port: +smtpPort,
    emailSender,
  },
  appName,
  apiGatewayKey,
  activationKeyExpiry: +activationKeyExpiry!,
};
