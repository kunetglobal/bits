import dotenv from "dotenv";

dotenv.config();

const { SAKURA_TOKEN, SAKURA_CLIENT_ID } = process.env;

if (!SAKURA_TOKEN || !SAKURA_CLIENT_ID) {
	throw new Error(
		"Environment variables SAKURA_TOKEN and SAKURA_CLIENT_ID must be set.",
	);
}

export const config = {
	SAKURA_TOKEN,
	SAKURA_CLIENT_ID,
};
