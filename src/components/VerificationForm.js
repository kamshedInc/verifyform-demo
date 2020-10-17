import React, { useState, useEffect } from 'react'
import decodeHash from '../helperFunctions/hash'
import updateVerifiedFields from '../requests/updateVerifiedFields'

/* ------------- Components ------------- */
import PhoneVerify from './phone/PhoneVerify'
import Loading from './Loading'
import Success from './Success'
import Fail from './Fail'
import Scanner from './Scanner'

export default function VerificationForm() {
    const [ userInfo, setUserInfo ] = useState(null)
    const [ step, setStep ] = useState(1)
    const [ phone, setPhone ] = useState(null)
    const [ dL, setDL ] = useState(null)
    const [ face, setFace ] = useState(null)
    const [ loading, setLoading ] = useState(null)
    const [ success, setSuccess ] = useState(null)

    useEffect(async () => {
        const search = window.location?.search
        if (search) {
            const hash = search.split("?p=")[1]
            console.log("hash", hash)
            //  decode hash to get id and emailaddress
            const { id, emailaddress } = await decodeHash({"hash": hash})

            //  update verified_fields in profile item
            updateVerifiedFields({"emailaddress": emailaddress}, id, emailaddress)
            setUserInfo({
                "id": id,
                "emailaddress": emailaddress
            })

        }
    }, [])

    useEffect(() => {
        if (face) setSuccess(true)
    },[face])

    if (loading === true) return <Loading step={ step }/>
    else if (success === false) return <Fail/>
    else if (success === true) return <Success phone={ phone } dL={ dL } face={ face }/>
    else if (step > 1) {
        return (

            <Scanner 
                step={ step }
                userInfo={ userInfo }
                handleStep={ e => setStep(e) } 
                handleDL={ e => setDL(e) }
                handleFace={ e => setFace(e) }
            />
        )   
    }
    else {
        return (
            <PhoneVerify 
                handleStep={ e => setStep(e) } 
                handlePhone={ e => setPhone(e) }
                setLoading={ e => setLoading(e) }
                setSuccess={ e => setSuccess(e) }
                userInfo={ userInfo }
                step={ step }
                phone={ phone }
            />
        )
    }
}