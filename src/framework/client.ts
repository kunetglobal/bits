import { Client, TextChannel } from "discord.js";

export class Agent extends Client {
	async sendMessage(channelId: string, message: string) {
		const channel = await this.channels.fetch(channelId);
		if (channel?.isTextBased()) {
			(channel as TextChannel).send(message);
		} else {
			console.error(`Channel ${channelId} is not a text channel.`);
		}
	}
}
