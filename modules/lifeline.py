from discord.ext import commands


class Lifeline(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def ping(self, ctx):
        await ctx.send('Ping!')

    @commands.Cog.listener()
    async def on_message(self, message):
        if message.content == 'status':
            await message.channel.send('all systems operational', reference=message)
            print("received status")
