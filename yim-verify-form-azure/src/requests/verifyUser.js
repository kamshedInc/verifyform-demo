import uuid from 'react-uuid'

export default function verifyUser(props) {
    const controller = new AbortController()
    const signal = controller.signal
    props.setLoading(true)
    fetch('https://localhost:3000/api/verifyUser', {
        method: 'POST',
        body: {
            uuid: uuid(),
            phone: props.phone,
            DL: props.form
        },
        signal
    })
    .then(res => {
        return res.json()
    })
    .then(info => {
        console.log(info)
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