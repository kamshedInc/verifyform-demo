import { dLVerifyRequest } from '../../config'

export default function verifyUser(props) {
    const driversLicense = props.dL
    const controller = new AbortController()
    const signal = controller.signal
    props.setLoading(true)
    fetch(dLVerifyRequest, {
        method: 'POST',
        body: driversLicense,
        signal
    })
    .then(res => {
        console.log(res.json())
        props.setLoading(false)
        props.setSuccess(true)
    })
    .catch(err => {
        if (err.name === 'AbortError') {
            console.log('Fetch aborted');
        }
        else console.error(err)
    })
}