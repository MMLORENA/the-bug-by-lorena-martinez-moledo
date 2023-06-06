import dotenv from "dotenv";

dotenv.config();

const {
  ACTIVATION_KEY_EXPIRY: activationKeyExpiry,
  API_GATEWAY_KEY: apiGatewayKey,
  APP_NAME: appName,
  AUTH_FRONT_URL: authFrontUrl,
  DEBUG: debug,
  EMAIL_SENDER: emailSender,
  JWT_SECRET: jwtSecret,
  MONGODB_DEBUG: mongoDbDebug,
  MONGODB_URL: mongoDbUrl,
  PORT: port,
  REDIS_HOST: redisHost,
  REDIS_PASSWORD: redisPassword,
  REDIS_PORT: redisPort,
  SMTP_HOST: smtpHost,
  SMTP_PASSWORD: smtpPassword,
  SMTP_PORT: smtpPort,
  SMTP_USERNAME: smtpUsername,
  SWAGGER_BASIC_AUTH_PASSWORD: swaggerBasicAuthPassword,
  SWAGGER_BASIC_AUTH_USERNAME: swaggerBasicAuthUsername,
  TOKEN_EXPIRY: tokenExpiry,
} = process.env;

if (
  !activationKeyExpiry ||
  !apiGatewayKey ||
  !appName ||
  !authFrontUrl ||
  !debug ||
  !emailSender ||
  !jwtSecret ||
  !mongoDbDebug ||
  !mongoDbUrl ||
  !port ||
  !redisHost ||
  !redisPassword ||
  !redisPort ||
  !smtpHost ||
  !smtpPassword ||
  !smtpPort ||
  !smtpUsername ||
  !swaggerBasicAuthPassword ||
  !swaggerBasicAuthUsername ||
  !tokenExpiry
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
  activationKeyExpiry: +activationKeyExpiry,
  authFrontUrl,
};
