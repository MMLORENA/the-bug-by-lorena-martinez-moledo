import dotenv from "dotenv";

dotenv.config();

const {
  PORT: port,
  MONGODB_URL: mongoDbUrl,
  MONGODB_DEBUG: mongoDbDebug,
  DEBUG: debug,
  ORIGIN_WHITELIST: originWhitelist,
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
  AUTH_FRONT_URL: authFrontUrl,
  REDIS_HOST: redisHost,
  REDIS_PORT: redisPort,
  REDIS_PASSWORD: redisPassword,
} = process.env;

if (
  !port ||
  !tokenExpiry ||
  !activationKeyExpiry ||
  !smtpPort ||
  !smtpHost ||
  !smtpUsername ||
  !smtpPassword ||
  !emailSender ||
  !appName ||
  !apiGatewayKey ||
  !redisHost ||
  !redisPort ||
  !redisPassword ||
  !mongoDbUrl ||
  !mongoDbDebug ||
  !originWhitelist ||
  !debug ||
  !appName ||
  !jwtSecret ||
  !swaggerBasicAuthPassword ||
  !swaggerBasicAuthUsername ||
  !authFrontUrl
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
