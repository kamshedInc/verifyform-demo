/* export  */async function compareFaceToProfile(p_id, emailaddress, results) {
    const url = "https://westus.api.cognitive.microsoft.com/face/v1.0/verify"
    //const { faceid } = results
    const options = {
        method: 'post',
        headers: {
            "Ocp-Apim-Subscription-Key": "5cc7a1d1262143e4bdd30003da328de4",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            faceid1: "38704c1b-fdd2-4455-ba4e-f20a9f4c62d1",
            faceid2: "99b3df6a-0443-43b4-ab73-7bb80ce3fc2a"
        })
    }
    fetch(url,options).then(result => {
        const data = result.json()
        console.log("result:", data)
    })
    //return
}
compareFaceToProfile()