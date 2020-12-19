export default function captureVideo(video,res,step) {
    const environment = step === 2 
        ? { facingMode: "environment" } 
        : { facingMode: "user" }

    navigator.mediaDevices.getUserMedia({ 
        audio: false, 
        video: true, 
        environment 
    })
    .then(stream => {
        video.srcObject = stream
        res(video)
    }, err => console.error(err))
}