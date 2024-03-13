import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("status")
	.setDescription("check agent's status");

export async function execute(interaction: CommandInteraction) {
	return interaction.channel?.send("**all systems operational**");
}
