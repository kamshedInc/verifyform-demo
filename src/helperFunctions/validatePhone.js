export default function validatePhone(phone) {
    const regex = /^(1|1-)? ?(( ?\d{3}[- ]*)|(\( ?\d{3}[- ]*\) *))\d{3}[- ]?\d{4}$/g
    return regex.test(phone)
}