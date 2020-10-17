import React from 'react'

export default function Loading(props) {
    console.log('props in Loading', props)

    function msgPerStep() {
        if (props.step === 1) return <h1>Verifying phone number...</h1>
        else if (props.step === 2) return <h1>Verifying user...</h1>
        else return <h1>Loading...</h1>
    }

    return (
        <>
            { msgPerStep() }
        </>
    )
}