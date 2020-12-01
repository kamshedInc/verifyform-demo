import React, { useEffect, useState } from 'react'
import "./ProgressBar.css"

export default function ProgressBar(props) {
    const [step, setStep ] = useState(1)
    
    useEffect(() => {
        if (props.step !== step) {
            setStep(props.step)
        }
    }, [props.step])

    const title = [
        "Phone Number Verification",
        "Identity Verification",
        "Facial Verification"
    ]

    const circles = step => {
        const c = []
        for (let i = 0;i < 3; i++) {
            let className = "circle"
            if (i === step - 1) className = "circle active"
            c.push(<div 
                key={i}
                id="progress-circle" 
                className={className} 
            />)
        }
        return c
    }

    return (
        <div className="section__top">
            <section className="section__progress section dark-bg">
                <div className="container__progress">
                    { circles(step) }
                </div>
            </section>
            <section className="section__header section light-bg">
                <div className="container__header container">
                    <h2 className="header__title">{ title[step - 1] }</h2>
                </div>
            </section>
        </div>
    )
}