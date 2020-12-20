import config from '../config'

export async function updateVerifiedFields(update, id, emailaddress, res) {
    const url = config.UPDATE_VERIFIEDFIELDS
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