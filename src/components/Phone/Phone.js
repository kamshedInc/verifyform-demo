import React, { useEffect, useRef/* , useState */ } from 'react'
import './Phone.css'
//import { useUpdateLog } from '../../LogContext'
import validatePhone from '../../helperFunctions/validatePhone'
import postPhone from '../../requests/postPhone'
import submitSmsCode from '../../requests/submitSmsCode'
import Btn from '../Btn/Btn'

export default function Phone(props) {
    //const [ setCode ] = useState(null)
    //const [ setErrMsg ] = useState(false)
    //const { updateLog } = useUpdateLog()
    const phoneRef = useRef()
    const codeRef = useRef()
    const phoneErrRef = useRef()
    const codeErrRef = useRef()

    useEffect(() => {
        if (!props.phone.phoneNumber) {
            phoneRef.current.classList.add('active')
        } else {
            codeRef.current.classList.add('active')
        }
    }, [])

    const submit = e => {
        e.preventDefault()
        let input;
        if (phoneRef.current.classList.contains('active')) {
            input = phoneRef.current.children[0]
        } else {
            input = codeRef.current.children[0]
        }
        const val = input.value

    //  phone
        if (input.name === 'phonenumber') {
            const validPhoneNumber = validatePhone(val)
        //  valid format: update state and get sms code
            if (validPhoneNumber) {
                props.setPhone(prev => ({
                    ...prev,
                    phoneNumber:val,
                    verificationStatus:"pending"
                }))
                postPhone({
                    phone:val
                })
                if (phoneRef.current.classList.contains('invalid')) {
                    phoneRef.current.classList.remove('invalid')
                    phoneErrRef.current.classList.remove('invalid')
                }
                nextInput()
            } else {
                phoneRef.current.classList.add('invalid')
                phoneErrRef.current.classList.add('invalid')
                //setErrMsg(true)
            }
    //  sms code
        } else {
            if (props.phone.phoneNumber) {
                const regex = /^[0-9]{6}$/g
                if (regex.test(val)) {
                    //setCode(val)
                    if (codeRef.current.classList.contains('invalid')) {
                        codeRef.current.classList.remove('invalid')
                        codeErrRef.current.classList.remove('invalid')
                    }
                    submitSmsCode({
                        userInfo: props.userInfo,
                        code: val,
                        phone: props.phone,
                        setPhone: props.setPhone,
                        setStep: props.setStep,
                        logs: props.logs,
                        setLoading: props.setLoading
                    })
                } else {
                    codeRef.current.classList.add('invalid')
                    codeErrRef.current.classList.add('invalid')
                }
            } //else setErrMsg(true)
        }
    }

    const nextInput = () => {
        phoneRef.current.classList.remove('active')
        codeRef.current.classList.add('active')
    }

    return (
        <div className="section section__phone grid">
            <p ref={ phoneErrRef } className="grid--center grid--main err--msg">
                    Please enter a valid phone number</p>
            <p ref={ codeErrRef } className="grid--center grid--main err--msg">
                    Required code must be six-digits in length</p>

            <form className="form__phone grid--main grid--center">
                <div className="container__inputs">
                    <div ref={ phoneRef } className="wrapper wrapper__phonenumber">
                        <input 
                            type="tel"
                            name="phonenumber"
                            className="input__phonenumber" 
                            placeholder="Phone Number"
                            onKeyPress={e => {
                                if (e.key === "Enter") submit(e)
                            }}/>
                    </div>
                    <div ref={ codeRef } className="wrapper wrapper__smscode">
                        <input
                            name="smscode" 
                            className="input__smscode" 
                            placeholder="6-digit code"
                            onKeyPress={e => {
                                if (e.key === "Enter") submit(e)
                            }}/>
                    </div>
                </div>
                <Btn 
                    type='submit' 
                    name="Submit" 
                    onClick={ submit }/>
            </form>
        </div>
    )
}