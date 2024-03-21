import {
	type BitFieldResolvable,
	Client,
	type GatewayIntentsString,
	type TextChannel,
} from "discord.js";

export interface AgentConfig {
	name: string;
	token: string;
	client_id: string;
	intents: BitFieldResolvable<GatewayIntentsString, number>;
	init?(): void;
}

export class Agent extends Client {
	constructor(config: AgentConfig) {
		super({ intents: config.intents });

		if (config.init) config.init();

		this.login(config.token);
		this.once("ready", () => {
			console.log(`${config.name} is ready!`);
		});

		this.on("messageCreate", async (message) => {
			console.log(message.content);
			const messageContent = message.content.toLowerCase();

			if (messageContent.includes("status")) {
				await this.sendMessage(
					message.channelId,
					"**`( =ω=)b`: all systems operational**",
				);
			}
		});
	}

	async sendMessage(channelId: string, message: string): Promise<void> {
		const channel = await this.channels.fetch(channelId);
		if (channel?.isTextBased()) {
			(channel as TextChannel).send(message);
		} else {
			console.error(`Channel ${channelId} is not a text channel.`);
		}
	}
}
