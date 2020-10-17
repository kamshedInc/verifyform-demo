import React, { useState, useEffect } from 'react'
import InputPhone from './InputPhone'
import InputSmsCode from './InputSmsCode'
import validatePhone from '../../helperFunctions/validatePhone'
import postPhone from '../../requests/phone/postPhone'
import getSmsCode from '../../requests/phone/getSmsCode'

export default function PhoneVerify(props) {
    console.log("props here is phonverify:", props)
    const [ phone, setPhone ] = useState({
        phoneNumber: null, 
        verificationStatus: null, 
        isVerified: false
    })
    const [ code, setCode ] = useState(null)
    const [ errMsg, setErrMsg ] = useState(false)
    const [ firstLoad, setFirstLoad ] = useState(true)

    useEffect(() => { //runs only when phone isVerified true
        if (phone.isVerified === true) props.handleStep(props.step + 1)
    }, [phone.isVerified])

    useEffect(() => setFirstLoad(false), []) // on initial load

    useEffect(() => { // runs on **phone** state change, only after initial load
        if (firstLoad === false) {
            const validPhoneNumber = validatePhone(phone.phoneNumber)
            console.log("is valid phone:",validPhoneNumber)
            if (validPhoneNumber) { // validation to go here
                console.log("Get sms code >>>")
                postPhone({
                    phone: phone.phoneNumber
                })
                setPhone(prev => ({...prev, verificationStatus: "pending"}))
            } 
            else setErrMsg(true) 
        }
    }, [phone.phoneNumber])

    useEffect(() => { // runs on **code** state change, only after initial load
        if (firstLoad === false) {
            getSmsCode({
                userInfo: props.userInfo,
                code: code,
                phone: phone,
                setCode: setCode,
                setPhone: setPhone,
                phoneStatus: props.handlePhone,
                setErrMsg: setErrMsg
            })
        }
    }, [code])


    function currState() {
        if (errMsg === true) return <p>Please enter a valid phone number</p>
        else if (phone.verificationStatus !== null ) return <InputSmsCode code={ code } handleCode={e => setCode(e)}/>
        else return <InputPhone phone={ phone.phoneNumber } handlePhone={e => setPhone(e)}/>
    }

    return (
        <>
            { currState() }
        </>
    )
}