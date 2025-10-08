import api from "../interceptors/tokenValidity.interceptor.jsx";

export async function getDataWithInterceptor(path) {
    const req = await api.get(path)
    return await req.data
}

export async function getDataWithoutInterceptor(path) {
    const req = await fetch(
            path, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            })
    return await req.json()
}