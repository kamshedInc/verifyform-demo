const config = require('../config')
const { getBlob } = require('../components/Scanner/scannerUtil')

async function getFaceId(canvas,stream,controller,res,rej) {
    const url = config.FACEAPI_FACEID
    const keyname = config.FACEAPI_KEYNAME
    const key = config.FACEAPI_KEY
    if (stream?.srcObject?.active === false) rej()
    else {
        const { blob } = getBlob(canvas,stream)
        const requestOptions = {
            method: 'POST',
            headers: {
                [keyname]: key,
                "Content-Type": "application/octet-stream"
            },
            body: await blob,
            signal: controller.signal
        }
        fetch(url, requestOptions)
        .then(r => {
            if (r.ok) return r.json()
            else throw new Error()
        })
        .then(response => {
            if (response.length > 0) res(response)
        })
        .catch(error => console.log('error', error))
    }
}

module.exports = getFaceId