import React from 'react'

export default function DLVerify(props) {
    console.log('props in DLVerify', props)

    const goBack = () => {
        console.log("this is where we go back to prev step...")
        props.handleStep(props.step - 1)
    }

    const handleSubmit = e => {
        e.preventDefault()
        const form = new FormData(e.target)
        props.handleDL(form)
        props.handleStep(props.step + 1)
    }

    return (
        <>
            <form onSubmit={e => handleSubmit(e)}>
                <label htmlFor="frontOfLicense">Picture on front of drivers license</label>
                <input type="file" name="frontOfLicense" accept="image/png, image/jpeg"></input>
                <label htmlFor="backOfLicense">Bottom barcode on back of drivers license</label>
                <input type="file" name="backOfLicense" accept="image/png, image/jpeg"></input>
                <button onClick={() => goBack()} type="button">Go back</button>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}