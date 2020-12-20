import React, { useState, useEffect } from 'react'
import decodeHash from '../requests/hash'
import { updateVerifiedFields } from '../requests/updateVerifiedFields'

/* ------------- Components ------------- */
import Phone from './Phone/Phone'
import Scanner from './Scanner/Scanner'
import { useUpdateLog } from '../LogContext'


class NestLogs extends Map {
    setState(...args) {
        this.state = Object.assign({},...args)
        return this.state
    }

    set(p,v) {
        if (v !== this.get(p)?.complete) {
            this.state && this.state.updateLog(p,v)
        }
        return super.set(p,{complete:v})
    }

    get(p) { return super.get(p) }
}
const logState = new NestLogs()


export default function VerificationForm(props) {
    const [ userInfo, setUserInfo ] = useState(null)
    const [ nestedLogs ] = useState(logState)
    const [ setSuccess ] = useState(true)
    const { updateLog } = useUpdateLog()



//  This is used as middle man to update logs
//  from a non-react component
    useEffect(() => {
        nestedLogs.setState({
            updateLog: (p,v) => updateLog(p,v)
        })
    },[])




    useEffect(() => {
        updateLog("Verifying email", false)
        const search = window.location?.search
        if (search) {
            const hash = search.split("?p=")[1]
            //  decode hash to get id and emailaddress
            decodeHash({"hash": hash}).then(async data => {
                const { id, emailaddress } = data
                updateLog("Getting user info", true)
                const updateEmail = await updateVerifiedFields({"emailaddress": emailaddress}, id, emailaddress)
                updateEmail && updateLog("Verifying email", true)
                process.nextTick(() => {
                    setUserInfo({
                        id: id,
                        emailaddress: emailaddress
                    })
                })
            })
        } else {
            setUserInfo({
                id: "eadf8fd7-0ab1-4fc6-8880-e563e3efa0d8",
                emailaddress: "joshrlear@gmail.com"
            })
            updateLog("Verifying email", true)
        }
    }, [])

    if (props.step > 1) {
        return (
            <Scanner 
                step={ props.step }
                userInfo={ userInfo }
                setStep={ e => props.setStep(e) } 
                logs={ nestedLogs }
                setLoading={ props.setLoading }
            />
        )   
    }
    else {
        return (
            <Phone
                setStep={ e => props.setStep(e) }
                setPhone={ e => props.setPhone(e) }
                setLoading={ props.setLoading }
                setSuccess={ e => setSuccess(e) }
                userInfo={ userInfo }
                step={ props.step }
                phone={ props.phone }
                logs={ nestedLogs }
            />
        )
    }
}