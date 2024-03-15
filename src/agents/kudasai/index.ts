import { Agent } from "../../framework/client";
import dotenv from "dotenv";

dotenv.config();

const { KUDASAI_TOKEN, KUDASAI_CLIENT_ID } = process.env;
if (!KUDASAI_TOKEN || !KUDASAI_CLIENT_ID) {
	throw new Error(
		"Environment variables KUDASAI_TOKEN and KUDASAI_CLIENT_ID must be set.",
	);
}

export const agent = new Agent({
	token: KUDASAI_TOKEN,
	client_id: KUDASAI_CLIENT_ID,
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
