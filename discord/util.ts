require('dotenv').config()
const { env } = process

import { exec } from 'node:child_process'
import concat from 'concat-stream'
import { Base64Encode } from 'base64-stream'

export function parseAllStrings(obj: any): any {
    // Base case: if obj is a string, parse it as JSON
    if (typeof obj === 'string') {
        try {
            return JSON.parse(obj);
        } catch (error) {
            return obj; // Return the original string if parsing fails
        }
    }
  
    // If obj is an array, recursively parse its elements
    if (Array.isArray(obj)) {
        return obj.map(item => parseAllStrings(item));
    }
  
    // If obj is an object, recursively parse its properties
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key] = parseAllStrings(obj[key]);
            }
        }
    }
  
    return obj;
}

function getPythonCommand() {
    switch (process.platform) {
        case 'win32':
            return 'py'
        default:
            return 'python3'
    }
}

export class Bearer {
    token: string | null = null
    email: string
    password: string
    timecreated: Date = new Date()

    refreshTimeout = 86400000 /* One day */ / 2 /* 12 horus */

    // constructor(email: string, password: string) {
    constructor() {

        this.email = env.ACCOUNT_EMAIL ?? ''
        this.password = env.ACCOUNT_PASSWORD ?? ''

        // this.refresh()
    }

    refresh() {
        return new Promise((resolve, reject) => {
            exec(`${getPythonCommand()} -c "import msmcauth; print(msmcauth.login('${this.email}', '${this.password}').access_token)"`,
                (error, stdout, stderr) => {
                    if (stderr)
                        console.log('Failed to grab bearer.' + stderr)
                    // console.log(`-->${stdout}<--`)
                    this.token = stdout
                    resolve(stdout)
                }
            )
        })

    }

    async get(override: boolean = true) {
        const now = new Date()
        
        //@ts-ignore
        if (!((now - this.timecreated) > this.refreshTimeout) || override) {
            await this.refresh()
        }

        // console.log('==' + this.token)

        return this.token
    }
}

export let bearer = new Bearer()