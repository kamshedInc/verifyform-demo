import React, { useRef, useEffect, useState } from 'react'
import captureVideo from '../helperFunctions/captureVideo'


export default function Scanner(props) {
    const [ stream, setStream ] = useState(null)
    const [ frame, setFrame ] = useState(null)
    const [ capture, setCapture ] = useState(null)
    //const [ data, setData ] = useState(null)
    const video = useRef(null)
    const canvas = useRef(null)
    const image = useRef(null)
    //const { step } = props
    
    useEffect(() => {
        setStream(video)
        setFrame(canvas)
        setCapture(image)
    }, [video, canvas])
    

    useEffect(() => {
        if (stream !== null) {
            /* setData( */captureVideo(stream, frame, capture, props)//)
        }
    }, [stream])


    return (
        <>
            <div className="video-wrap">
                <video id="video" ref={ video } width="720" height="560" style={{ position: "absolute" }} autoPlay muted></video>
            </div>
            <canvas id="canvas" ref={ canvas } width="720" height="560" style={{ display: "none" }}></canvas>
            <img id="image" alt="blank for screen capture" ref={ image } width="720" height="560" style={{ display: "none" }}></img>
        </>
    )
}