const getFaceId = require('../../requests/getFaceId')
const compareFaceToProfile = require('../../requests/compareFace')
const { updateVerifiedFields } = require('../../requests/updateVerifiedFields')


export function scannerFace(props) {
    const { id,emailaddress,logs,step,setStep,canvas,stream,setLoading } = props
    let waitForFace;
    
//  Detect Face
    const controller = new AbortController()
    const promiseFace = new Promise((res,rej) => {

//  logs: Face Detection
    logs.set("Scanning for face",false)


        waitForFace = setInterval(() => getFaceId(canvas,stream,controller,res,rej), 3200)
    }).then(faceId => {
        clearInterval(waitForFace)
        controller.abort()
        setLoading(true)
        return faceId
    }).then(() => {
    //  logs: Face Detection
        logs.set("Scanning for face",true)
    //  logs: Face Verification
        logs.set("Comparing facial landmarks",false)
    }).catch(() => {
        clearInterval(waitForFace)
        controller.abort()
    })


//  Compare Face
    promiseFace.then(async data => {
        if (data !== undefined) {
            const { faceId } = await data[0]
            return compareFaceToProfile(id,emailaddress,await faceId)
        }
    }).then(async verifiedFields => {
        if (await verifiedFields?.isIdentical) {
            return new Promise(async res => {
                updateVerifiedFields({profileImage:true},id,emailaddress,res)
            })
        }
    }).then(() => {
        if (stream.srcObject.active === true) {
        //  logs: Face Verification
            logs.set("Comparing facial landmarks",true)
            setStep(4)
            return
        }
    })
}
