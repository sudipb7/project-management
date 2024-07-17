require("dotenv").config(".env");

export const {
  NODE_ENV = "development",
  PORT = 8000,
  CORS_ORIGIN = "http://localhost:3000",
  LOG_FORMAT = "dev",
  LOG_DIR = "../logs",
  DATABASE_URL,
} = process.env;
