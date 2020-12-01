export default function captureVideo(video,res) {
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(stream => {
        video.srcObject = stream
        res(video)
    }, err => console.error(err))
}