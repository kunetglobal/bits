import { exec } from "node:child_process";
import { Agent } from "../../framework/client";
import dotenv from "dotenv";

dotenv.config();

const { KUMIKO_TOKEN, KUMIKO_CLIENT_ID } = process.env;
if (!KUMIKO_TOKEN || !KUMIKO_CLIENT_ID) {
	throw new Error(
		"Environment variables KUMIKO_TOKEN and KUMIKO_CLIENT_ID must be set.",
	);
}

export const agent = new Agent({
	token: KUMIKO_TOKEN,
	client_id: KUMIKO_CLIENT_ID,
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

function isSystemdServiceActive(serviceName: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		exec(`sudo systemctl is-active ${serviceName}`, (error, stdout) => {
			if (error) {
				reject(error);
			} else {
				resolve(stdout.trim() === "active");
			}
		});
	});
}

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
