import React, { useState } from 'react'

export default function InputSmsCode(props) {
    const [ code, setCode ] = useState(props.code)

    const handleCode = e => {
        e.preventDefault()
        setCode(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        props.handleCode(code)
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <label htmlFor="phone">Code:</label>
            <input onChange={e => handleCode(e)} id="code" name="code" pattern="^[0-9]{6}$"/>
            <button type="submit">Verify Phone</button>
        </form>
    )
}