import { requestSmsCode } from '../config'

export default function postPhone(props) {
    const controller = new AbortController()
    const signal = controller.signal
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({"phone": props.phone});

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      signal
    };

    fetch(requestSmsCode, requestOptions)
    .then(res => {
        return res.json()
    })
    .catch(err => {
        if (err.name === 'AbortError') {
            console.log('Fetch aborted');
        }
        else console.error(err)
    })
}