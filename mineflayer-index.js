require('dotenv').config()

const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const fs = require('fs')

const { env } = process
const endpoint = [37147, 56, -5999]

var bot = mineflayer.createBot({
    username: env.ACCOUNT_EMAIL, // minecraft username
    password: env.ACCOUNT_PASSWORD, // minecraft password, comment out if you want to log into online-mode=false servers
    auth: "microsoft",
    host: "skyblock.net",
    version: "1.19.2"
})

bot.loadPlugin(pathfinder)

bot.on("spawn", async () => {
    console.log("[!] Spawned")
    bot.chat("/skyblock")
    // bot.chat("/visit buyblock")
    bot.chat("/visit 1by2")

    bot.on('chat', (username, message) => {
        if (message.includes('Pillow has requested that you teleport to them.')) {
            bot.chat('/tpaccept')
            setTimeout(() => {
                fs.writeFileSync('items.json', JSON.stringify(bot.entities, null, 4))
                const stands = Object.keys(bot.entities)
                .map(key => bot.entities[key])
                .filter(x => x.name === 'armor_stand' && typeof x.equipment[5] === 'object')
                .filter(x => x.equipment[5].type === 998)
                    .map(x => x.equipment[5].nbt.value)
                    .filter(x => x.SkullOwner !== undefined)
                    .map(x => Object({
                        name: JSON.parse(x.display.value.Name.value).extra.map(x=>x.text).join(''),
                        texture: JSON.parse(atob(x.SkullOwner.value.Properties.value.textures.value.value[0].Value.value)).textures.SKIN.url,
                    }))
                    
                    console.log(stands)
                    fs.writeFileSync('stands.json', JSON.stringify(stands, null, 4))
                    require('./save-heads')(stands)
            }, 500)
        }
    })
})

process.stdin.on('data', (data) => {
    const message = data.toString().trim()

    try {
        eval(message)
    } catch (e) {
        console.error(e)
    }
})