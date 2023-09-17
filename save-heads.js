const fs = require('fs')
if (!fs.existsSync('skins')) fs.mkdirSync('skins')
const { Readable } = require('stream');
const { finished } = require('stream/promises');

module.exports = (stands) => {
    let i = 0;
    let interval = setInterval(async () => {
        if (i >= stands.length) {
            console.log(`Done! ${stands.length}`)
            clearInterval(interval)
            return;
        }
        console.log(`Doing head ${i}/${stands.length}`)

        const stand = stands[i]
        const texture_id = stand.texture.match(/([a-z0-9]{48,72})/g)
        let url = `https://visage.surgeplay.com/head/512/${texture_id}.png?y=75&no=shadow`
        const outpath = 'skins/' + stand.name.replace(/ /g, '_').toLowerCase() + '.png'

        if (outpath === 'skins/creeper_egg.png') {
            url = url.replace('y=75', 'y=165')
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        
        if (fs.existsSync(outpath)) fs.rmSync(outpath)
        // if (fs.existsSync(outpath)) { i++; return}

        const fileStream = fs.createWriteStream(outpath, { flags: 'wx' });
        await finished(Readable.fromWeb(response.body).pipe(fileStream));

        console.log(`Downloaded ${url} -> ${outpath} [${JSON.stringify(stand.texture)}]`)
        i++;
    }, 1500)
}