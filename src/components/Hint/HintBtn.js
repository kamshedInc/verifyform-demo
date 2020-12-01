import React from 'react'
import './HintBtn.css'

export default function HintBtn(props) {
    return (
        <div className="wrapper wrapper__btn--hint grid">
            <div className="container contianer__log-icon container__btn--hint circle grid--bottomRight">
                <button className="btn--hint log-icon" onClick={e => props.onClick(e)}>
                    ?
                </button>
            </div>
        </div>
    )
}