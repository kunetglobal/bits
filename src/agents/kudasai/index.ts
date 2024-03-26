import { Agent } from "../../framework/agent";
import dotenv from "dotenv";

dotenv.config();

const { KUDASAI_TOKEN, KUDASAI_CLIENT_ID } = process.env;
if (!KUDASAI_TOKEN || !KUDASAI_CLIENT_ID) {
	throw new Error(
		"Environment variables KUDASAI_TOKEN and KUDASAI_CLIENT_ID must be set.",
	);
}

export const agent = new Agent({
	name: "kudasai",
	token: KUDASAI_TOKEN,
	clientId: KUDASAI_CLIENT_ID,
	intents: ["Guilds", "GuildMessages", "MessageContent"],
	messageScope: {
		readMentionsOnly: true,
		readBotsMessages: false,
	},
});
