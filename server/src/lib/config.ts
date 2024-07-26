require("dotenv").config(".env");

export const {
  NODE_ENV = "development",
  PORT = 8000,
  CORS_ORIGIN = "http://localhost:3000",
  LOG_FORMAT = "dev",
  LOG_DIR = "../logs",
  DATABASE_URL,
  AWS_REGION = "ap-south-1",
  AWS_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_KEY_ID,
} = process.env;
