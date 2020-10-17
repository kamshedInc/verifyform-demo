import React from 'react'

export default function Success(props) {
    const { phone, dL, face } = props
    console.log("phone:", phone)
    console.log("dL:", dL)
    console.log("face:", face)
    const listOfResults = (phone, dL, face) => {
        if (!phone && !dL && !face) return <p>We could not successfully verify you profile.</p>
        return <p>Verified something. Look at console...</p>
    }
    return (
        <>
            { listOfResults }
        </>
    )
}