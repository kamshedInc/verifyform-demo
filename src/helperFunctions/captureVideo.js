export default function captureVideo(video,res,step) {
    const rear = step === 2 
        ? true
        : false

    navigator.mediaDevices.getUserMedia({ 
        audio: false, 
        video: { facingMode: (rear? "environment" : "user") }
    })
    .then(stream => {
        video.srcObject = stream
        res(video)
    }, err => console.error(err))
}