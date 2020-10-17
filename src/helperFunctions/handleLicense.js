export async function detectLicense(opt, /* licenseDetected ,*/ interval) {
    return await fetch(require('../config').CV_DETECT_ID, opt)
    .then(result => { return result.json()})
    .then(async result => {
        const tagName = result.predictions[0].tagName
        const probability = result.predictions[0].probability
        const noLicense = tagName === "Negative" || tagName === "Low Quality"
        const toBlurry = probability < .95
        console.log("Result:", { [tagName]: probability }, "To blurry?", toBlurry)
        if (noLicense || toBlurry) throw new Error("No License detected.")
        console.log("there is a DL and not blurry")
        //licenseDetected = true
        interval && clearInterval(interval)
        return result
    })
    .catch(err => console.error("This is the error:", err))
}

export async function readLicense(blob) {
    const keyName = require('../config').READAPI_KEY_NAME
    const keyValue = require('../config').READAPI_KEY_VALUE
    //  Read
    //  =======================================================
    const getRead = await fetch(require('../config').READAPI_READ, {
        'method': 'POST',
        'body': blob,
        'headers': {
           'Content-Type': 'application/octet-stream', 
           [keyName]: keyValue
        }
    }).then(d => {
        return d.headers.get('operation-location')
    })
    .catch('error', e => {
        console.error(e);
    })
    console.log(getRead)
    //  getRead
    //  =======================================================
    let result;
    do {
        result = await fetch(getRead, {
            'method': 'GET',
            'headers': { [keyName]: keyValue }
        })
        .then(r => {
            return r.json()
        })
        .catch(err => console.error(err))
        setTimeout(() => {console.log("Checking till status is = 'succeeded'")}, 500)
    } while (result.status === "running")
    return result
}