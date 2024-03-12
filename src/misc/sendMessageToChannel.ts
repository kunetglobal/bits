import { TextChannel } from "discord.js";
import { client } from "../agents/kumiko";

export async function sendMessageToChannel(channelId: string, message: string) {
	const channel = await client.channels.fetch(channelId);
	if (channel?.isTextBased()) {
		(channel as TextChannel).send(message);
	} else {
		console.error(`Channel ${channelId} is not a text channel.`);
	}
}
