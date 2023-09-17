require('dotenv').config()
const { env } = process

import { Client, Events, GatewayIntentBits } from 'discord.js'

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const prefix = '$'

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift()?.toLowerCase();

    if (!command) return

    if (command.match(/[\.\/\\]/g)) {
        message.reply('No!')
        return
    }

    try {
        require(`./commands/${command}`).default.execute(message, args, prefix)
    } catch (e: any) {
        switch (e.code) {
            case 'MODULE_NOT_FOUND': 
                message.channel.send(`I don't know that command! (\`${prefix}${command}\`)`)
                break;
            default:
                console.log(e.toString())
                message.channel.send('Something went wrong running that, try again later!')
                break;
        }
    }
    
    
    
})

// Log in to Discord with your client's token
client.login(env.BOT_TOKEN);