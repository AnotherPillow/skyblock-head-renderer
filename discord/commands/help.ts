import type { Message } from "discord.js"
import { EmbedBuilder } from "discord.js"


export default {
    name: 'help',
    /**
     * Executes the command
     */
    execute(message: Message, args: string[], prefix: string) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0xB182FF)
            .setAuthor({
                name: message.author.displayName,
                iconURL: message.author.displayAvatarURL() ?? 'https://discord.com/assets/c09a43a372ba81e3018c3151d4ed4773.png',
            })
            .setTitle('Head Renderer Help')
            .setDescription('How to use this bot:')
            .addFields(
                { name: `\`${prefix}rendernbt [NBT]\``, value: 'Renders a head from NBT data. ' },
                { name: `What is NBT data?`, value: 'The Named Binary Tag (NBT) is a tree data structure used by Minecraft in many save files to store arbitrary data.', inline: true },
                { name: `How do I get it?`, value: 'If you have Meteor Client installed, run `.nbt copy` while holding the head.', inline: true },
                { name: `\`${prefix}renderign [IGN]\``, value: 'Renders a head from an IGN. ' },
                { name: `\`${prefix}renderskin\``, value: 'Renders a head from an attached PNG file (must be 64x32 or 64x64)' },
            )
            .setTimestamp()
            .setFooter({ text: 'Head Renderer Help Message' });

        message.reply({ embeds: [helpEmbed] })
    }
}