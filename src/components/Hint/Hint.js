import React, { useEffect, useState } from 'react'
import './Hint.css'
import Btn from '../Btn/Btn'
let hint;

export default function Hint(props) {
    const [ info, setInfo ] = useState()

    useEffect(() => {
        hint = hint_info(props.step)
        const { value } = hint.next()
        setInfo(value)
    },[props])

    const click = () => {
        const { value, done } = hint.next()
        if (done) props.setHint(false)
        else setInfo(value)
    }


    return (
        <div className=" section section__hint info grid">
            <div className="container container__hint info grid--main grid--center">
                <h1 id="info">{ info }</h1>
            </div>
            <Btn name="Next" enabled={ true } type="button" onClick={ click }/>
        </div>
    )
}

function* hint_info(step) {
    let info;
    switch (step) {
        case 1: info = [
            'Time to verify your phone number',
            'Enter your phone number and select "Get Code"',
            'We\'ll then send you a 6-digit code',
            'Enter the code and submit'
        ]
            break;
        case 2: info = [
            'Now we\'ll verify your identity',
            'This requies a drivers license or state issued ID',
            'Hold the ID to the camera until scan complete',
            'Make sure ID is visible and image is not blurry'
        ]
            break;
        case 3: info = [
            'Last, we need to verify your profile images',
            'Allow the camera to scan your face like we did with ID',
            'Look directly at the camera until scan complete'
        ]
            break;
        case 4: info = [
            'All done! Click next to see the final results'
        ]
            break;
    }
    for (let i of info) yield i
}