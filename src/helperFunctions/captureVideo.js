import { xbr4x } from 'xbr-js'
const config = require('../config')
const handleLicense = require('./handleLicense')
const compareFaceToProfile = require('./compareFace')
const predictionKey = require('../config').CV_DETECT_ID_PREDICTION_KEY

let stream = undefined
let canvas = undefined
let imageElement = undefined

//  Grab single image from video stream
//  =======================================================
export default async function captureVideo(video, frame, capture, props) {
    !canvas && (canvas = frame.current)
    !stream && (stream = video.current)
    !imageElement && (imageElement = capture.current)

    navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
            video.current.srcObject = stream
            scanVideo(props)
    }, err => console.error(err))
}

//  Get DL/ID info
//  =======================================================
function detectAndReadLicense(p_id, resolve, reject, interval) {
    console.log(stream)
    console.log("scanning for DRIVERSLICENSE...")

    //  On interval paint frame of video to canvas
    //  ===================================================
    const context = canvas.getContext('2d')
    context.drawImage(stream, 0, 0)
    const imageData = context.getImageData(0, 0, stream.width, stream.height)
    new Promise((resolve, reject) => {

        //  Send image to APIs to detect and read DL
        //  ===================================================
        canvas.toBlob(async blob => {
            imageElement.setAttribute('src', canvas.toDataURL())
            const headers = new Headers()
            headers.append("Content-Type", "application/octet-stream")
            headers.append("Prediction-Key", predictionKey)
            const opt = {
                "method": "POST",
                "headers": headers,
                "body": blob
            }

            const detectedLic = await handleLicense.detectLicense(opt, interval)
            console.log("This is the detectedLic:", detectedLic)

            //  Upscale image 4x for better text recognition
            //  ===================================================
            if (detectedLic) {
                const scaledWidth = stream.width * 4
                const scaledHeight = stream.height * 4
                const imageBuffer = new Uint32Array(imageData.data.buffer)
                const upscaledImg = xbr4x(imageBuffer, stream.width, stream.height)
                const scaledImageData = new ImageData(new Uint8ClampedArray(upscaledImg.buffer), scaledWidth, scaledHeight)
                console.log(scaledImageData)
                canvas.width = scaledWidth;
                canvas.height = scaledHeight;
                context.putImageData(scaledImageData, 0, 0)
                resolve()
            }
            else reject()
        })
    })
    .then(async () => {
        canvas.toBlob(async upscaledBlob => {
            const data = await require('./handleLicense').readLicense(upscaledBlob)
            if (!data) resolve()
            const text = extractInfo(data)
            return await validateUserInfo(p_id, text)
        })
    })
    
}

function extractInfo(data, allText = []) {
    const line = data.pop()
    if (line === undefined) return allText
    const { text } = line
    allText.unshift(text)
    return extractInfo(data, allText)
}

async function validateUserInfo(p_id, text) {
    const options = {
        method: 'post',
        headers: {
            "p_id": p_id
        },
        body: text
    }
    return await fetch("https://yim-comparedltoprofile.azurewebsites.net/api/compareDLToProfile?", options)
}

//  Based on step determine what kind of image to look for
//  =======================================================
function scanVideo(props, interval) {
    const { p_id } = props
    console.log("the p_id inside scanVideo", p_id)
    new Promise((resolve, reject) => {
        const interval = setInterval(() => detectAndReadLicense(p_id, resolve, reject, interval), 3000) 
    }).then(dLData => {
        //props.handleDL(dLData)
        const interval = setInterval(() => detectAndVerifyFace(interval, props), 1000)
    })
    .catch(() => {
        scanVideo(props, interval)
    })
    .finally(() => props.handleStep(4))
}

//  Get Face-API data
//  =======================================================
function detectAndVerifyFace(interval, props) {
    console.log("scanning for FACE...")
    canvas.getContext('2d').drawImage(stream, 0, 0)
        canvas.toBlob(blob => {
            const data = new FormData()
            data.append('image', blob, "imageToCheck")

            const requestOptions = {
                method: 'POST',
                body: data
            }

            fetch(config.FACEAPI_DETECT, requestOptions)
            .then(async response => {
                if (!response.ok) return
                console.log(response.status, response.ok)
                interval && clearInterval(interval)

                //  get faceid and compare
                const results = await response.json()
                return await compareFaceToProfile(results)

                //props.handleFace("Verified")
            })
            .catch(error => console.log('error', error))

        }, 'image/jpeg')
}