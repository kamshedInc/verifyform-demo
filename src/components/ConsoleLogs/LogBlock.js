import React, { useEffect, useRef } from 'react'
import './LogBlock.css'


export default function LogBlock(props) {
    const msgRef = useRef()
    useEffect(() => {
        if (props.complete) {
            msgRef.current.classList.remove('waiting')
        }
    }, [props])

    return (
        <>
            {
                <div className="container__log dark-bg">
                    <div className="contianer__log-icon circle">
                        <p className="log-icon">?</p>
                    </div>
                    <p ref={ msgRef } className="log-msg waiting">{ props?.info }</p>
                    <h6 className="log-time">{ props?.time }s</h6>
                </div>
            }
        </>
    )
}