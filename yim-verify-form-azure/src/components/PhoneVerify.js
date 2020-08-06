import React, { useState } from 'react'

export default function PhoneVerify(props) {
    const [ phone, setPhone ] = useState(props.phone)
    const [ errMsg, setErrMsg ] = useState(null)
    

    const validatePhone = e => {
        e.preventDefault()
        setPhone(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        props.handlePhone(phone)
        if (phone) { // validation to go here
            console.log("this is where we go to next step >>>")
            props.handleStep(props.step + 1)
        } 
        else setErrMsg(<p>Please enter a valid phone number</p>) 
    }

    return (
        <>
            <form onSubmit={e => handleSubmit(e)}>
                <label htmlFor="phone">Phone Number</label>
                <input onChange={e => validatePhone(e)} type="tel" id="phone" name="phone" pattern="^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$"/>
                <button type="submit">Submit</button>
            </form>
            { errMsg }
        </>
    )
}