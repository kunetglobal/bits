import dotenv from "dotenv";

dotenv.config();

const { KUDASAI_TOKEN, KUDASAI_CLIENT_ID } = process.env;

if (!KUDASAI_TOKEN || !KUDASAI_CLIENT_ID) {
  throw new Error("Environment variables KUDASAI_TOKEN and KUDASAI_CLIENT_ID must be set.");
}

export const config = {
  KUDASAI_TOKEN,
  KUDASAI_CLIENT_ID,
};
