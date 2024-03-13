import { Agent } from "../../framework/client";
import { config } from "./config";
import { exec } from "child_process";

export const agent = new Agent({
	intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

agent.once("ready", () => {
	console.log("kumiko is ready!");
});

agent.login(config.KUMIKO_TOKEN);

function isSystemdServiceActive(serviceName: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		exec(`systemctl is-active ${serviceName}`, (error, stdout, stderr) => {
			if (error) {
				reject(error);
			} else {
				resolve(stdout.trim() === "active");
			}
		});
	});
}

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

setInterval(async () => {
	const serviceName = "mailchimp";
	try {
		const isActive = await isSystemdServiceActive(serviceName);
		if (isActive) {
			console.log(`${serviceName} is active.`);
		} else {
			console.log(`${serviceName} is not active.`);
			await agent.sendMessage(
				"your-channel-id",
				`${serviceName} is not active.`,
			);
		}
	} catch (error) {
		console.error(`Error checking status of ${serviceName}:`, error);
	}
}, 60000); // 60000ms = 1 minute
