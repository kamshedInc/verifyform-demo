const { detectLicense, readLicense } = require('../../requests/handleLicense')
const updateVerifiedFields = require('../../requests/updateVerifiedFields')
const { getBlob, upscale, compareInfoToDB } = require('./scannerUtil')


export function scannerDL(props) {
    const { id,emailaddress,logs,step,setStep,canvas,stream,setLoading } = props
    if (step > 2) return
    let waitForDL;

//  logs: License Detection
    logs.set("Scanning for drivers license",false)
    

    const controller = new AbortController()
    const promiseDL = new Promise((res,rej) => {
        waitForDL = setInterval(async() => {
            if (step > 2 || controller.signal.aborted) rej()
            else detectLicense(canvas,stream,controller,res,rej)
        }, 3200) 
    })
    .then(r => {
        clearInterval(waitForDL)
        controller.abort()
        setLoading(true)
        return r
    })
    .catch(err => {
        clearInterval(waitForDL)
        controller.abort()
        console.error(err)
    })
    .finally(() => {
    //  logs: License Detections
        logs.set("Scanning for drivers license",true)
    })


//  Get Info from DL
    promiseDL.then(async r => {
        const { context, imageData } = r
        upscale(canvas,stream,context,imageData)
        return await getBlob(canvas,stream)
    })
    .then(async r => {
        const blob =  await r.blob
        return new Promise(async res => await readLicense(blob,res))
        .then(async info => {
        //  logs: Identity verification
            logs.set("Verifying DL information",false)
            return compareInfoToDB(await info,id,emailaddress)
        })
        .then(async verifiedFields => {
        //  logs: Identity verification
            logs.set("Verifying DL information",true)
            updateVerifiedFields(await verifiedFields,id,emailaddress)
        }).then(r => {
            setStep(3)
            return r
        })
    })

//  Handle Errors
    promiseDL.catch(err => console.error(err))
}
