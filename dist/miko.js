"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Hello TypeScript");
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({ intents: [] });
client.on('ready', () => {
    if (!client.user || !client.application) {
        return;
    }
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.content.toLowerCase() === 'ping') {
        yield message.reply('Pong!');
    }
}));
client.login('YOUR_BOT_TOKEN');
