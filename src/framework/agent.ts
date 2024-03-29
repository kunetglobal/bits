import {
	type BitFieldResolvable,
	Client,
	type GatewayIntentsString,
	type Message,
	type TextChannel,
} from "discord.js";

interface MessageScope {
	readBotsMessages?: boolean;
	readMentionsOnly?: boolean;
}

export interface AgentConfig {
	name: string;
	token: string;
	clientId: string;
	intents: BitFieldResolvable<GatewayIntentsString, number>;
	init?(): void;
	messageScope: MessageScope;
}

export class Agent extends Client {
	private config: AgentConfig;

	constructor(config: AgentConfig) {
		super({ intents: config.intents });

		if (config.init) config.init();

		this.config = config;

		this.login(config.token);
		this.once("ready", () => {
			console.log(`${config.name} is ready!`);
		});

		this.on("messageCreate", async (message) => {
			if (!this.messageInScope(message)) return;

			const messageContent = message.content.toLowerCase();
			console.log(messageContent);

			if (messageContent.includes("status")) {
				await this.sendMessage(
					message.channelId,
					"**all systems operational**",
				);
			}
		});
	}

	messageInScope(message: Message<boolean>): boolean {
		const messageScope = this.config.messageScope;
		if (message.author.bot && !messageScope.readBotsMessages) {
			return false;
		}
		if (
			!message.mentions.users.has(this.config.clientId) &&
			messageScope.readMentionsOnly
		) {
			return false;
		}

		return true;
	}

	async sendMessage(channelId: string, message: string): Promise<void> {
		const channel = await this.channels.fetch(channelId);
		if (channel?.isTextBased()) {
			(channel as TextChannel).send(message);
		} else {
			console.error(`channel ${channelId} is not a text channel.`);
		}
	}
}
