import React, { useRef, useEffect, useState } from 'react'
import captureVideo from '../../helperFunctions/captureVideo'


export default function DriversLicenseReader() {
    const [ stream, setStream ] = useState(null)
    const [ data, setData ] = useState(null)
    const video = useRef(null)

    useEffect(() => {
        setStream(video)
    }, [video])
    
    useEffect(() => {
        if (stream !== null && data === null) {
            setData(captureVideo(stream))
        }
    }, [stream])


    return (
        <>
            {/* <Webcam
                id="video"
                ref={video}
                audio={false}
                height={720}
                width={1280}
            /> */}

            <div className="video-wrap">
                <video id="video" ref={ video } width="720" height="560" autoPlay muted></video>
            </div>
        </>
    )
}