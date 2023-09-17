export type textObject = {
    extra: {
        bold: boolean,
        italic: boolean,
        underlined: boolean,
        strikethrough: boolean,
        obfuscated: boolean,
        color: string,
        text: string
    }[],
    text: string
}

export type standDecoded = {
    SkullOwner: {
        Id: Number[]
        Properties: {
            textures: {
                textures: {
                    SKIN: {
                        url: string
                    }
                }
            }[]
        }
    },
    display: {
        Lore: textObject[],
        Name: textObject,
    }
}

export type standWithEncoded = {
    SkullOwner: {
        Id: Number[]
        Properties: {
            textures: {
                Value: string
            }[]
        }
    },
    display: {
        Lore: textObject[],
        Name: textObject,
    }
}