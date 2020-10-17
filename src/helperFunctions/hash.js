export default async function decodeHash(hash) {
    console.log("this is hash inside decodeHash:", hash)
    const url = "https://yim-hash.azurewebsites.net/api/handleHash?"
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