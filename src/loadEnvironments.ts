import dotenv from "dotenv";

dotenv.config();

const {
  PORT: port,
  MONGODB_URL: mongoDbUrl,
  MONGODB_DEBUG: mongoDbDebug,
  ORIGIN_WHITELIST: originWhitelist,
  JWT_SECRET: jwtSecret,
} = process.env;

export const environment = {
  port,
  mongoDbUrl,
  mongoDbDebug: mongoDbDebug === "true",
  originWhitelist: originWhitelist.split(","),
  jwtSecret,
};
