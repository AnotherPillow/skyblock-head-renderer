// import { bearer } from "./util";
import * as fs from 'node:fs'
// import { v4 as uuidv4 } from 'uuid'

/*export function mineskinUploadSkin(base64: string) {
    return new Promise(async (resolve, reject) => {
        const url = 'https://api.mineskin.org/generate/upload';
        const key = 'd175f64d0601005779e4fc3497ffb7c8fbbc00b90610052939a7ac173ccf3317'
    
        const imageBuffer = Buffer.from(base64, 'base64');
        const blob = new Blob([imageBuffer], { type: 'image/png' }); // Adjust the type accordingly
    
        const formData = new FormData();
        formData.append('file', blob, 'image.png'); // Set the desired file name
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${key}`,
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                resolve(data)
            } else {
                console.error('Failed to upload image:', response.statusText);
            }
        } catch (error: any) {
            console.error('An error occurred:', error.message);
        }
    })
}*/
/*export function minecraftUploadSkin(bearer: string, base64: string, dest: string, uuid: string, variant: 'slim' | 'classic' = 'slim') {
    console.log(base64)
    console.log(bearer)

    fs.writeFileSync(dest, Buffer.from(base64, 'base64'))
    
    
    return new Promise(async (resolve, reject) => {
        const apiUrl = 'https://api.minecraftservices.com/minecraft/profile/skins';
        const form = new FormData();

        // Append the form fields
        form.append('variant', variant);
        form.append('file', new Blob([fs.readFileSync(dest)]), uuid)

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${bearer}`,
                    'Content-Type': 'multipart/form-data'
                },
                body: form,
            });

            console.log(await response.text())

            if (response.status === 200) {
                console.log('Skin uploaded successfully.');
            } else {
                console.error(`Failed to upload skin. Status code: ${response.status}`);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    })
}*/

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