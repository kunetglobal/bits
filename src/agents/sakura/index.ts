import { Agent } from "../../framework/client";
import dotenv from "dotenv";

dotenv.config();

const { SAKURA_TOKEN, SAKURA_CLIENT_ID } = process.env;
if (!SAKURA_TOKEN || !SAKURA_CLIENT_ID) {
	throw new Error(
		"Environment variables SAKURA_TOKEN and SAKURA_CLIENT_ID must be set.",
	);
}

export const agent = new Agent({
	token: SAKURA_TOKEN,
	client_id: SAKURA_CLIENT_ID,
	intents: ["Guilds", "GuildMessages"],
});

agent.on("messageCreate", async (message) => {
	console.log(message.content);
	const messageContent = message.content.toLowerCase();

	if (messageContent.includes("status")) {
		await agent.sendMessage(
			message.channelId,
			"**`( =ω=)b`: all systems operational**",
		);
	}
});
