import {
	type BitFieldResolvable,
	Client,
	type GatewayIntentsString,
	type TextChannel,
} from "discord.js";

export interface AgentConfig {
	token: string;
	client_id: string;
	intents: BitFieldResolvable<GatewayIntentsString, number>;
}

export class Agent extends Client {
	constructor(config: AgentConfig) {
		super({ intents: config.intents });

		this.login(config.token);

		this.once("ready", () => {
			console.log("kumiko is ready!");
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
