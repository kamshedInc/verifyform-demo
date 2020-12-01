const { getBlob } = require('../components/Scanner/scannerUtil')
const predictionKey = require('../config').CV_DETECT_ID_PREDICTION_KEY

export async function detectLicense(canvas,stream,controller,res,rej) {
    const url = require('../config').CV_DETECT_ID
    const { blob, context, imageData } = getBlob(canvas,stream)
    const headers = new Headers()
    headers.append("Content-Type", "application/octet-stream")
    headers.append("Prediction-Key", predictionKey)
    const opt = {
        method: "POST",
        headers: headers,
        body: await blob,
        signal: controller.signal
    }

    fetch(url, opt)
    .then(result => {
        if (result.status !== 200) rej("too many requests")
        return result.json()
    })
    .then(result => {
        const tagName = result.predictions[0].tagName
        const probability = result.predictions[0].probability
        console.log(tagName,probability)
        const noLicense = tagName === "Negative" || tagName === "Low Quality"
        if (noLicense) return
        res({blob,context,imageData})
    })
    .catch(err => console.error("This is the error:", err))
}




export function readLicense(blob,res) {
    const controller1 = new AbortController()
    const controller2 = new AbortController()
    const url = require('../config').READAPI_READ
    const keyname = require('../config').READAPI_KEY_NAME
    const key = require('../config').READAPI_KEY_VALUE
    
    const opt = {
        method: 'POST',
        body: blob,
        headers: {
           'Content-Type': 'application/octet-stream', 
           [keyname]: key
        },
        signal: controller1.signal
    }

    //  Read
    //  =======================================================
    const readDL = new Promise(res => {
        fetch(url, opt)
        .then(d => {
            if (d.headers.has('Operation-Location')) {
                controller1.abort()
                res(d.headers.get('Operation-Location'))
            }
        })
        .catch(err => {
            console.log(err)
        })
    })


    //  getRead
    //  =======================================================
    readDL.then(getRead => {
        new Promise(res => checkResult(getRead,keyName,keyValue,controller2,res))
        .then(r => {
            let result;
            new Promise((res,rej) => getInfo(r,res,rej))
            .then(r => {
                controller2.abort()
                result = r
                res(r)
            }).catch(() => {
                console.log("Not enough lines. this is the result")
                return result
            })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}




async function checkResult(getRead,keyName,keyValue,controller2,res) {
    const readResult = await fetch(getRead, {
        method: 'GET',
        headers: { [keyName]: keyValue },
        signal: controller2.signal
    })
    .then(r => { return r.json() })
    .then(result => {
        if (result.status !== "succeeded") {
            sleep(3200)
            checkResult(getRead,keyName,keyValue,controller2,res)
        } else res(result)
    })
    .catch(err => { return {error:err} })
}


function getInfo(data,res,rej) {
    const lines = data.analyzeResult?.readResults[0]?.lines
    if (lines.length > 4) {
        res(lines.map(line => line.text))
    } else rej()
}


function sleep(ms) {
    const now = Date.now()
    let curr = null
    do {
      curr = Date.now()
    } while (curr - now < ms)
}