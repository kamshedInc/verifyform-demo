import { verifySmsCode } from '../config'
import updateVerifiedFields from './updateVerifiedFields';

export default function submitSmsCode(props) {
    const { logs } = props
    logs.set("Verify Phonenumber", false)
    props.setLoading(true)
    let id,emailaddress;
    if (props.userInfo) {
        ({ id, emailaddress } = props.userInfo  )
    }
    const controller = new AbortController()
    const signal = controller.signal
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        signal
    }
    
    fetch(`${verifySmsCode}&code=${props.code}`, requestOptions)
    .then(result => {
        if (result.ok) return result.json()
        else throw new Error()
    })
    .then(response => {
        logs.set("Verify Phonenumber", true)
        updateVerifiedFields({"phoneNumber": response.phone}, id, emailaddress)
        props.setPhone(prev => ({ 
            ...prev, 
            verificationStatus: "complete", 
            isVerified: true 
        }))
    })
    .catch(err => {
        if (err.name !== 'AbortError') {
            props.setPhone(prev => ({
                ...prev,
                verificationStatus: "complete",
                isVerified: false
            }))
        }
    }).finally(() => props.setStep(2))
}