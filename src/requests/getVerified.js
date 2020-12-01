import config from '../config'
const { CosmosClient } = require("@azure/cosmos")
const endpoint = config.COSMOSDB_ENDPOINT
const key = config.COSMOSDB_KEY
const dbId = config.COSMOSDB_ID_DB
const containerId = config.COSMOSDB_ID_CONTAINER
const client = new CosmosClient({ endpoint, key })

export default async function getVerified(id,emailaddress) {
    const container = client.database(dbId).container(containerId)
    const result = await container.item(id,emailaddress).read().catch(err => console.error(err))
    const data = result?.resource
    console.log(result?.statusCode)
    if (result?.statusCode === 200) {
        return data.verified
    } else return null
} 