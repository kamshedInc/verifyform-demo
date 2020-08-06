import React, { useState, useEffect } from 'react'
/* ------------- Components ------------- */
import PhoneVerify from './PhoneVerify'
import DLVerify from './DLVerify'
import Loading from './Loading'
import Success from './Success'
import Fail from './Fail'
/* ------------- Components ------------- */
import verifyUser from '../requests/verifyUser'

export default function VerificationForm() {
    const [ step, setStep ] = useState(1)
    const [ phone, setPhone ] = useState(null)
    const [ dL, setDL ] = useState(null)
    const [ loading, setLoading ] = useState(null)
    const [ success, setSuccess ] = useState(null) // true = success, false = fail

    useEffect(() => {
        if (!dL) return
        const args = {
            phone,
            dL,
            setLoading: e => setLoading(e),
            setSuccess: e => setSuccess(e),
        }
        verifyUser(args)
    }, [ dL ])

    if (loading === true) return <Loading/>
    else if (success === false) return <Fail/>
    else if (success === true) return <Success/>
    else if (step === 2) {
        return (
            <DLVerify 
                handleStep={e => setStep(e)} 
                handleDL={e => setDL(e)}
                step={ step }
                dL={ dL }
            />
        )   
    }
    else {
        return (
            <PhoneVerify 
                handleStep={e => setStep(e)} 
                handlePhone={e => setPhone(e)}
                step={ step }
                phone={ phone }
            />
        )
    }
}