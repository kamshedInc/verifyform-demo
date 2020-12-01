const { scannerDL } = require('./scannerDL')
const { scannerFace } = require('./scannerFace')

export default function scannerRouter(props) {
    let id,emailaddress = undefined
    const { userInfo,logs,step,setStep,setLoading,canvas,stream } = props
    if (userInfo) {
        id = userInfo.id
        emailaddress = userInfo.emailaddress
    }

    if (step === 2) scannerDL({id,emailaddress,logs,step,setStep,canvas,stream,setLoading})
    if (step === 3) scannerFace({id,emailaddress,logs,step,setStep,canvas,stream,setLoading})
}
