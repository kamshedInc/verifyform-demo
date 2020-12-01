import React, { useState } from 'react'
import './LogHistory.css'
import LogBlock from './LogBlock'
import { useLog } from '../../LogContext'

export default function ConsoleLogs() {
    const { logs, keys } = useLog()


    const getNext = (map,vals=[]) => {
        const next = map.next()
        if (next.done) return vals
        vals.push(next.value)
        return getNext(map,vals)
    }

    const block = () => {
        const vals = getNext(logs.values())
        return vals.map((l,i) => { 
            return (
            <LogBlock 
                key={ i } 
                time={ l.time }
                info={ l.info } 
                complete={ l.complete }
            />
            )
        })
    }

    return (
        <section className="section__logs section dark-bg">
            <div className="container__logs container">
                { keys && block() }
            </div>
        </section>
    )
}