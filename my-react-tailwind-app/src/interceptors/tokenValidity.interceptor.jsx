import axios from "axios";
import {isJwtValid} from "../utils/isJwtValid.js";

const api = axios.create({
    baseURL: 'http://localhost:5197/api'
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken')

    if (token) {
        isJwtValid(token);
        config.headers['Authorization'] = `Bearer ${token}`
        return config
    }
})

export default api