import { Agent } from "../../framework/client";
import { config } from "./config";

export const agent = new Agent({
	intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

agent.once("ready", () => {
	console.log("kudasai is ready!");
});

agent.login(config.KUDASAI_TOKEN);

agent.on("messageCreate", async (message) => {
	console.log(message.content);
	const messageContent = message.content.toLowerCase();

	// check if user has system-level access
	if (message.member?.roles.cache.some((role) => role.name === "S")) {
		console.log(message.member.roles.cache);
	}

	if (messageContent.includes("status")) {
		await agent.sendMessage(
			message.channelId,
			"**`( =ω=)b`: all systems operational**",
		);
	}
});
