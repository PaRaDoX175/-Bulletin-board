import {jwtDecode} from "jwt-decode";
import {modalController} from "../modalController.js";

export function isJwtValid(token) {
    const decoded = jwtDecode(token)
    if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('displayName')
        localStorage.removeItem('accessToken')
        modalController.openAuthModal()
        return false
    }
    return true
}

export const checkJwt = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        return isJwtValid(localStorage.getItem('accessToken'))
    } else return false
}