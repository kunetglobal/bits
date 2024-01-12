import dotenv from "dotenv";

dotenv.config();

const { KUMIKO_TOKEN, KUMIKO_CLIENT_ID } = process.env;

if (!KUMIKO_TOKEN || !KUMIKO_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  KUMIKO_TOKEN,
  KUMIKO_CLIENT_ID,
};
