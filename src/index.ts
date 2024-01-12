import { Client } from "discord.js";
import { config } from "./config";

const client = new Client({ 
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

client.once("ready", () => {
  console.log("kumiko is ready!");
});

client.on('messageCreate', async message => {
  console.log(message.content)
    const messageContent = message.content.toLowerCase();

    // check if user has system-level access
    if (message.member && message.member.roles.cache.some(role => role.name === 'S')) {
    console.log(message.member.roles.cache)  
    }

    if (messageContent.includes('status')) {
        await message.channel.send('**`( =ω=)b`: all systems operational**');
    }
});

client.login(config.KUMIKO_TOKEN);