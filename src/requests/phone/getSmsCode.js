import { verifySmsCode } from '../../config'
import updateVerifiedFields from '../updateVerifiedFields';

export default function getSmsCode(props) {
    console.log(props)
    const { id, emailaddress } = props.userInfo
    const controller = new AbortController()
    const signal = controller.signal
    console.log(verifySmsCode, props)
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        signal
    };

    fetch(`${verifySmsCode}&code=${props.code}`, requestOptions)
    .then(result => { return result.json() })
    .then(response => {

        //  update profileItem with phone verified status
        updateVerifiedFields({"phoneNumber": response.phone}, id, emailaddress)

        props.phoneStatus("Verified")
        props.setPhone(prev => ({ 
            ...prev, 
            verificationStatus: "complete", 
            isVerified: true 
        }))
    })
    .catch(err => {
        if (err.name === 'AbortError') {
            console.log('Fetch aborted');
        }
        else {
            props.setPhone(prev => ({
                ...prev,
                verificationStatus: "complete",
                isVerified: false
            }))
            props.setErrMsg(err)  
        }
    })
}