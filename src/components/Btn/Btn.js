import React from 'react'
import './Btn.css'

export default function Btn(props) {
    return (
        <div className="wrapper__nextBtn grid--bottom">
            <div className="container__btn btn">
                <button id="js-btn" type={ props.type } onClick={e => props.onClick(e)}>{props.name}</button>
            </div>
        </div>
    )
}