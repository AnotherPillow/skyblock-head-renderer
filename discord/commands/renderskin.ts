import type { Message, Attachment } from "discord.js"
import { EmbedBuilder } from "discord.js"
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'node:fs'
import path from 'node:path'
import download from 'image-downloader'

import { parseAllStrings, bearer } from "../util"
import type {textObject, standWithEncoded, standDecoded} from '../types'
import { minecraftUploadSkin } from "../skins"

export default {
    name: 'renderign',
    /**
     * Executes the command
     */
    async execute(message: Message, args: string[], prefix: string) {
        let responseMsg = await message.reply({ content: 'Rendering...' })

        if (message.attachments.size === 0) return message.reply('Please provide an image!')

        const attachment: Attachment = await (()=> {
            return new Promise((resolve, reject) => {
                message.attachments.forEach(element => {
                    resolve(element)
                    return
                });
            })
        })()

        if (attachment.width !== 64 || ![32,64].includes(attachment.height ?? 0)) 
            return message.reply('Invalid dimensions!')

        // const uuid = uuidv4()
        // const skinsdir = path.join(__dirname, '..', 'skins')
        // if (!fs.existsSync(skinsdir))
        //     fs.mkdirSync(skinsdir, { recursive: true })

        // const fp = path.join(skinsdir, uuid) + '.png'
        
        // let _fn = await download.image({
        //     url: attachment.url,
        //     dest: fp
        // })

        // console.log(_fn)

        // const b64 = fs.readFileSync(fp, 'base64')

        let _bearer = await bearer.get()

        // let sk = await minecraftUploadSkin(_bearer ?? '', b64, fp, uuid)
        let skin = await minecraftUploadSkin(_bearer ?? '', attachment.url)
        // console.log(skin)

        if (skin.error || !skin.textureKey || !skin.url) {
            const embed = new EmbedBuilder()
                .setColor(0xFF5E83)
                .setTitle(`Failed to render ${attachment.name}`)
                .setAuthor({
                    name: message.author.displayName,
                    iconURL: message.author.displayAvatarURL() ?? 'https://discord.com/assets/c09a43a372ba81e3018c3151d4ed4773.png',
                })
                .setDescription('An error occured processing that image, try again later or with another image.')
                .setTimestamp()

            responseMsg.edit({
                content: '',
                embeds: [ embed ]
            })

            return
        }

        
        let url = `https://visage.surgeplay.com/head/512/${skin.textureKey}.png?y=75&no=shadow`

        
        

        const embed = new EmbedBuilder()
            .setColor(0x75CEFF)
            .setTitle(`Render of ${attachment.name}'s head`)
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
                    name: 'Texture link',
                    value: skin.url
                }
            )
            .setTimestamp()


        responseMsg.edit({
            content: '',
            embeds: [ embed ]
        })

    }
                
}