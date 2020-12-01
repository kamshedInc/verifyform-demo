import { xbr4x } from 'xbr-js'
import config from '../../config'
const { CosmosClient } = require("@azure/cosmos")
const forbidden = [
    "_rid",
    "_self",
    "_etag",
    "_attachments",
    "_ts",
    "verified",
    "images",
    "id",
    "emailAddress",
    "phoneNumber"
]
 
const endpoint = config.COSMOSDB_ENDPOINT
const key = config.COSMOSDB_KEY
const dbId = config.COSMOSDB_ID_DB
const containerId = config.COSMOSDB_ID_CONTAINER
const client = new CosmosClient({ endpoint, key })


export function getBlob(canvas,stream) {
    if (!canvas) throw new Error('Please include canvas as first argument')
    else {
        const { width, height } = stream.getBoundingClientRect()
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d')
        context.drawImage(stream, 0, 0, width, height)
        const imageData = context.getImageData(0, 0, width, height)

        const blob = new Promise(res => {
            canvas.toBlob(b => res(b),'image/png') 
        }).then(blob => { return blob })
        .catch(e => {
            console.log(e)
            return
        })

        return {
            blob:blob,
            imageData:imageData,
            context:context
        }
    }
}


export function upscale(canvas,stream,context,imageData) {
    const scaledWidth = stream.videoWidth * 4
    const scaledHeight = stream.videoHeight * 4
    const imageBuffer = new Uint32Array(imageData.data.buffer)
    const upscaledImg = xbr4x(imageBuffer, stream.videoWidth, stream.videoHeight)
    const scaledImageData = new ImageData(new Uint8ClampedArray(upscaledImg.buffer), scaledWidth, scaledHeight)
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    context.putImageData(scaledImageData, 0, 0)
}


export function getInfo(data,res) {
    const lines = data.analyzeResult?.readResults[0]?.lines
    if (lines.length > 4) {
        res(lines.map(line => line.text))
    } else throw new Error("Issue reading DL info")
}


export async function compareInfoToDB(info,id,emailaddress) {
    let map = new Map()
    const container = client.database(dbId).container(containerId)
    const result = await container.item(id,emailaddress).read().catch(err => console.error(err))
    const data = result?.resource

    if (result.statusCode === 200) {
        for (let k in data) {
            if (forbidden.includes(k)) {
                delete data[k]
            }
        }

        const dbVals = __getVals(data)  //  database values
        const dbKeys = __getKeys(data)  //  database keys
        const pVals = __getVals(info)   //  values obtained via form

    //  match values to keys
        let count = 0
        for (let e of dbVals) {
          map.set(dbKeys[count++], e)
        }

    //  find matching values
        const resultArr = __CheckVals(dbVals,pVals)

    //  Getting keys for values found
        let result = {}
        map.forEach((e,i) => {
            if (resultArr.includes(e) && i !== undefined) {
                result[i] = e
            }
        })
        return result
    }
}


function __getVals(o, vals = []) {
    if (typeof o !== "object") return
    const keys = Object.keys(o)
    const values = Object.values(o)
    vals.push(...values.map((e,i) => {
        if (typeof e === "string") return e.toLowerCase()
        else return e
    }))
    keys.forEach(key => __getVals(o[key], vals))
    return vals
}
  
function __getKeys(o, keyArr = []) {
    if (typeof o !== "object") return keyArr
    const keys = Object.keys(o)
    keyArr.push(...keys)
    return keys.filter(k => __getKeys(o[k],keyArr))
}


function __CheckVals() {
    const matched = []
    const refs = arguments[0]
    const vals = arguments[1].join(" ")
    
    refs.forEach(e => {
        const regex_match = RegExp(e,'g')
        const iterate = vals.matchAll(regex_match)
        for (let i of iterate) {
            matched.unshift(i[0])
        }
    })
    return matched
}