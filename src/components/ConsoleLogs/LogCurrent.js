import React, { useEffect, useRef, useState } from 'react'
import './LogCurrent.css'
import LogBlock from './LogBlock'
import { useLog } from '../../LogContext'

export default function LogCurrent() {
    const [ log, setLog ] = useState(null)
    const { logs, keys } = useLog()

    useEffect(() => {
        if (keys.length) {
            const { info, time, complete } = logs.get(keys[keys.length-1])
            setLog({info, time, complete})
        }
    }, [keys])

    return (
        <section className="section__logs current section page--bottom dark-bg">
            <div className="container__logs current container">
                <LogBlock 
                    time={ log?.time }
                    info={ log?.info } 
                    complete={ log?.complete }
                />
            </div>
        </section>
    )
}