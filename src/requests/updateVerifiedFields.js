async function updateVerifiedFields(update, id, emailaddress, res) {
    const url = "https://prod-115.westus.logic.azure.com:443/workflows/0bd4892c27b34394a42421781da0f513/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=13xb5j09h5VNgLf06vAXNa1yeovIL446j_Yvl7agTa4"
    const options = {
        method: 'put',
        headers: {
            id: id,
            emailaddress: emailaddress,
            verified: true,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "verified_fields": update })
    }
    const result = await fetch(url,options)
    .then(result => {
        if (res) {
            res(result)
        } else return result
    })
}

module.exports = {updateVerifiedFields};