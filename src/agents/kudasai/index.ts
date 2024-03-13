import { CustomClient } from "../../framework/client";
import { config } from "./config";
import { exec } from "child_process";

export const client = new CustomClient({
	intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

client.once("ready", () => {
	console.log("kudasai is ready!");
});

client.login(config.KUDASAI_TOKEN);

client.on("messageCreate", async (message) => {
	console.log(message.content);
	const messageContent = message.content.toLowerCase();

	// check if user has system-level access
	if (message.member?.roles.cache.some((role) => role.name === "S")) {
		console.log(message.member.roles.cache);
	}

	if (messageContent.includes("status")) {
		await client.sendMessage(
			message.channelId,
			"**`( =ω=)b`: all systems operational**",
		);
	}
});
