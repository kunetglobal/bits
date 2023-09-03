import discord
from dotenv import load_dotenv
import os
from modules import lifeline
from discord.ext import commands

load_dotenv()  
intents = discord.Intents.all()
bot = commands.Bot(command_prefix='!', intents=intents)
KUMIKO = os.getenv('KUMIKO_TOKEN')

@bot.event
async def on_ready():
    print(f'Bot is connected as {bot.user}')

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    if message.content.lower() == 'status':
        await message.channel.send('`( =ω=)b` **all systems operational!**')

    await bot.process_commands(message)

bot.run(KUMIKO)