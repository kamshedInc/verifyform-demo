const { CosmosClient } = require("@azure/cosmos")
const config = require('../config')
const endpoint = config.COSMOSDB_ENDPOINT
const key = config.COSMOSDB_KEY
const dbId = config.COSMOSDB_ID_DB
const containerId = config.COSMOSDB_ID_CONTAINER
const client = new CosmosClient({ endpoint, key })

async function compareFaceToProfile(id,emailaddress,faceId_Curr) {
    const faceId_DB = await getFaceIdFromDB(id,emailaddress)
    const url = config.FACEAPI_VERIFY
    const keyname = config.FACEAPI_KEYNAME
    const key = config.FACEAPI_KEY
    const options = {
        method: 'POST',
        headers: {
            [keyname]: key,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            faceid1: faceId_Curr,
            faceid2: faceId_DB
        })
    }
    return await fetch(url,options)
    .then(result => {
        const data = result.json()
        return data
    })
}

async function getFaceIdFromDB(id,emailaddress) {
    const container = client.database(dbId).container(containerId)
    const result = await container.item(id,emailaddress).read().catch(err => console.error(err))
    const data = result?.resource

    if (result.statusCode === 200) {
        for (let k in data) {
            if (k === "images") {
                return data[k][0]
            }
        }
    }
}

module.exports = compareFaceToProfile;