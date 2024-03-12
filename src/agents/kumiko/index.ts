import { Client } from "discord.js";
import { config } from "./config";
import { exec } from "child_process";
import { sendMessageToChannel } from "../../misc/sendMessageToChannel";

export const client = new Client({
	intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

client.once("ready", () => {
	console.log("kumiko is ready!");
});

client.login(config.KUMIKO_TOKEN);

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

client.on("messageCreate", async (message) => {
	console.log(message.content);
	const messageContent = message.content.toLowerCase();

	// check if user has system-level access
	if (message.member?.roles.cache.some((role) => role.name === "S")) {
		console.log(message.member.roles.cache);
	}

	if (messageContent.includes("status")) {
		await sendMessageToChannel(
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
			await sendMessageToChannel(
				"your-channel-id",
				`${serviceName} is not active.`,
			);
		}
	} catch (error) {
		console.error(`Error checking status of ${serviceName}:`, error);
	}
}, 60000); // 60000ms = 1 minute
