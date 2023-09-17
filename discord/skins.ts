import * as fs from 'node:fs'

export function minecraftUploadSkin(bearer: string, url: string, variant: 'slim' | 'classic' = 'slim'): Promise<{
    status: number,
    textureKey: string,
    url: string,
    error: any | null
}> {
    return new Promise(async (resolve, reject) => {
        const apiUrl = 'https://api.minecraftservices.com/minecraft/profile/skins';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${bearer}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: url,
                    variant: variant
                })
            });

            
            // console.log(await response.text())
            
            if (response.status === 200) {
                console.log('Skin uploaded successfully.');
                
                const resp = await response.json()

                //@ts-ignore
                const skin = resp.skins[0]

                resolve({
                    status: response.status,
                    textureKey: skin.textureKey,
                    url: skin.url,
                    error: null
                })
            } else {
                console.error(`Failed to upload skin. Status code: ${response.status}`);
                resolve({
                    status: response.status,
                    textureKey: '',
                    url: '',
                    error: await response.text()
                })
            }
        } catch (error) {
            console.error('An error occurred:', error);
            resolve({
                status: 600,
                textureKey: '',
                url: '',
                error: error
            })
        }
    })
}