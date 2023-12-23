import type { Message } from "discord.js"
import { EmbedBuilder } from "discord.js"

import { parseAllStrings } from "../util"
import type {textObject, standWithEncoded, standDecoded} from '../types'

export default {
    name: 'renderign',
    /**
     * Executes the command
     */
    async execute(message: Message, args: string[], prefix: string) {
        if (args.length == 0) return message.reply(`Please provide an IGN to render!`)
        if (!args[0].match(/^[A-Za-z0-9_]{1,20}$/)) return message.reply('Please provide a valid IGN to render.')
        
        const ign = args[0]
        let responseMsg = await message.reply({ content: 'Rendering...' })
        
        let url = `https://visage.surgeplay.com/head/512/${ign}.png?y=75&no=shadow`

        let uuid = (await fetch('https://api.mojang.com/users/profiles/minecraft/' + ign).then(x=>x.json())).id
        let skin = JSON.parse(
            atob(
                (await fetch('https://sessionserver.mojang.com/session/minecraft/profile/' + uuid)
                    .then(x=>x.json()))
                        .properties[0].value
            )
        ).textures.SKIN.url
        

        const embed = new EmbedBuilder()
            .setColor(0x75CEFF)
            .setTitle(`Render of ${ign}'s head.`)
            .setAuthor({
                name: message.author.displayName,
                iconURL: message.author.displayAvatarURL() ?? 'https://discord.com/assets/c09a43a372ba81e3018c3151d4ed4773.png',
            })
            .setImage(url)
            .addFields(
                {
                    name: 'Download the render',
                    value: url
                },
                {
                    name: 'Download the skin',
                    value: skin
                }
            )
            .setTimestamp()


        responseMsg.edit({
            content: '',
            embeds: [ embed ]
        })

    }
                
}