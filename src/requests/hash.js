import config from "../config"

export default async function decodeHash(hash) {
    const url = config.HASH
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hash)
    }
    return fetch(url,options).then(data => {
        return data.json() 
    })
}