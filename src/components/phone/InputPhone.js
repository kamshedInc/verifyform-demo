import React, { useState } from 'react'

export default function InputPhone(props) {
    const [ phone, setPhone ] = useState(props.phone)

    const validatePhone = e => {
        e.preventDefault()
        setPhone(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        props.handlePhone({phoneNumber: phone})
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <label htmlFor="phone">Phone Number</label>
            <input onChange={e => validatePhone(e)} type="tel" id="phone" name="phone" pattern="^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$"/>
            <button type="submit">Send Code</button>
        </form>
    )
}