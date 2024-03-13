import dotenv from "dotenv";

dotenv.config();

const { KUMIKO_TOKEN, KUMIKO_CLIENT_ID } = process.env;

if (!KUMIKO_TOKEN || !KUMIKO_CLIENT_ID) {
	throw new Error(
		"Environment variables KUMIKO_TOKEN and KUMIKO_CLIENT_ID must be set.",
	);
}

export const config = {
	KUMIKO_TOKEN,
	KUMIKO_CLIENT_ID,
};
