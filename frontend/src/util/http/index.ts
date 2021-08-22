import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const httpVideo = axios.create({
    baseURL: "http://127.0.0.1:8000/api"
});

const instances = [httpVideo];

export function addGlobalRequestInterceptor(
    onFulfilled?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
    onRejected?: (error: any) => any
) {
    const ids: number[] = [];
    for (let i of instances) {
        const id = i.interceptors.request.use(onFulfilled, onRejected);
        ids.push(id);
    }
    return ids;
}

export function removeGlobalRequestInterceptor(ids: number[]) {
    ids.forEach(
        (id, index) => instances[index].interceptors.request.eject(id)
    )
}

export function addGlobalResponseInterceptor(
    onFulfilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: AxiosError) => any
) {
    const ids: number[] = [];
    for (let i of instances) {
        const id = i.interceptors.response.use(onFulfilled, onRejected);
        ids.push(id);
    }
    return ids;
}

export function removeGlobalResponseInterceptor(ids: number[]) {
    ids.forEach(
        (id, index) => instances[index].interceptors.response.eject(id)
    )
}

export default httpVideo;