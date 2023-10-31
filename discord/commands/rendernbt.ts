import type { Message } from "discord.js"
import { EmbedBuilder } from "discord.js"

import { parseAllStrings } from "../util"
import type {textObject, standWithEncoded, standDecoded} from '../types'

export default {
    name: 'rendernbt',
    /**
     * Executes the command
     */
    async execute(message: Message, args: string[], prefix: string) {
        if (args.length == 0) return message.reply(`Please provide NBT data! See ${prefix}help on how to get that.`)
        
        const validjsonstring = (
            args.join(' ')
            .replace('I;', '')
            .replace(/([{,]\s*)([A-Za-z_\-][A-Za-z0-9_\-]*)(\s*:)/g, '$1"$2"$3')
            .replace(/'([^']+)'/g, '"$1"')
            .replace(/(\"Name\"\:)['"]/, `$1`)
            .replace(`"],"Name"`, `],"Name"`)
            .replace(`"Lore":["`, `"Lore":[`) + '}'
            )
            .replace(/}"}}$/, '}}}')
            .replace(/"}}}$/, '}}')

        const _data: standWithEncoded = await new Promise((resolve, reject) => {
            try {
                resolve(parseAllStrings(JSON.parse(validjsonstring)))
            } catch (e: any) {
                if (e.toString().match(/^SyntaxError: Unexpected token . in JSON at position/))
                    return message.reply(`Invalid input data! See ${prefix}help on how to get the correct data.`)
            }
        });

        //@ts-ignore
        const data: standDecoded = (function () {
            let __data = _data

            //@ts-ignore
            __data.SkullOwner.Properties.textures = __data.SkullOwner.Properties.textures.map(x=>x.Value = JSON.parse(Buffer.from(x.Value, 'base64').toString('utf-8')))

            return __data

            
        })()

        // console.log(JSON.stringify(data, null, 4))

        let responseMsg = await message.reply({ content: 'Rendering...' })

        const _Name = data.display.Name
        const name = _Name.extra ? _Name.extra[0].text : _Name.text
        
        const _Lore = data.display.Lore[0]
        const lore = _Lore.extra ? _Lore.extra[0].text : _Lore.text

        const texture_url = data.SkullOwner.Properties.textures[0].textures.SKIN.url
        const texture_id = texture_url.match(/([a-z0-9]{48,72})/g)
        let url = `https://visage.surgeplay.com/head/512/${texture_id}.png?y=75&no=shadow`

        const embed = new EmbedBuilder()
            .setColor(0x75CEFF)
            .setTitle('Render of ' + name)
            .setDescription(lore)
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
                    value: texture_url
                }
            )
            .setTimestamp()


        responseMsg.edit({
            content: '',
            embeds: [ embed ]
        })

    }
                
}