import React, { useRef, useEffect, useState, useCallback } from 'react'
import captureVideo from '../../helperFunctions/captureVideo'
import scannerRouter from './scannerRouter'
import './Scanner.css'

export default function Scanner(props) {
    const [ video, setVideo ] = useState(null)
    const [ stream, setStream ] = useState(null)
    const [ canvas, setCanvas ] = useState(null)
    
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const imageRef = useRef(null)
    

    useEffect(() => {
        if (!video && !canvas) {
            setVideo(videoRef.current)
            setCanvas(canvasRef.current)
        }
    }, [])

    useEffect(() => {
        if (video) {
            if (!video.width) {
                new Promise(res => captureVideo(video,res))
                .then(r => setStream(r))
            }
        }
    }, [video])

    useEffect(() => {
        if (stream) {
            console.log(videoRef.current.width, videoRef.current.height)
            paintCanvas(canvas,stream,setCanvas)
            scannerRouter({...props,canvas,stream})
        }
        return () => {
            if (stream?.srcObject?.active) {
                const track = stream.srcObject.getTracks()[0]
                track.stop()
            }
        }
    }, [stream])

    return (
        <section className="section__video section__main">
            <div className="video-wrap">
                <video id="video" ref={ videoRef } style={{ position: "absolute" }} autoPlay muted></video>
            </div>
            <canvas id="canvas" ref={ canvasRef } style={{ display: "none" }}></canvas>
            <img id="image" alt="blank for screen capture" ref={ imageRef } style={{ display: "none" }}></img>
        </section>
    )
}

function paintCanvas(canvas,stream,setCanvas) {
    const { width, height } = stream.getBoundingClientRect()
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    context.drawImage(stream, 0, 0, width, height)
    setCanvas(canvas)
}