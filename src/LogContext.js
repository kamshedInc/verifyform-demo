import React, { useContext, useState, useEffect } from 'react'

const LogContext = React.createContext()
const LogUpdateContext = React.createContext()
class LogMap extends Map {
    setState(...args) {
        this.state = Object.assign({},...args)
        return this.state
    }

    set(p,v) {
        if (v.complete === true) {
            this.state && this.state.setComplete()
        }
        return super.set(p,v)
    }

    get(p) { return super.get(p) }
}

const logMap = new LogMap()
const intervalMap = new Map()

export function useLog() {
    return useContext(LogContext)
}

export function useUpdateLog() {
    return useContext(LogUpdateContext)
}

export function LogProvider({ children }) {
    const [ logs, setLogs ] = useState(logMap)
    const [ intervals, setIntervals ] = useState(intervalMap)
    const [ keys, setKeys ] = useState([])
    const [ complete, setComplete ] = useState(0)

    useEffect(() => {
        if (logs.size > 0) {
            logs.forEach(l => setKeys(prev => [...prev,l.info]))
        }
    },[])

    const updater = (i,c,t) => {
        logMap.set(i,{
            info:i,
            time:t,
            complete:c
        })
    }

    
    function updateLog(info, __complete) {
        if (__complete) {
            const l = logMap.get(info)
            updater(info,__complete, l?.time)
            clearInterval(intervals.get(info))
        } 
        else {
            if (logMap.has(info) === false) {
                updater(info,__complete,0)
                let d = Date.now()
                const interval = setInterval(() => {
                    const t = ((Date.now() - d) / 1000).toFixed(2)
                    updater(info,__complete,t)
                }, 100)
                intervals.set(info, interval)
                setKeys(prev => [...prev,info])
            }
        }
    }

    return (
        <LogContext.Provider value={{ logs, keys, complete, intervals }}>
            <LogUpdateContext.Provider value={{ updateLog: (i,c) => updateLog(i,c) }}>
                { children }
            </LogUpdateContext.Provider>
        </LogContext.Provider>
    )
}