import axios, { AxiosInstance } from 'axios';

class ApiClient {
    private api: AxiosInstance;

    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
    }

    public post<T>(url: string, data?: unknown) {
        return this.api.post<T>(url, data);
    }
}

export const apiClient = new ApiClient('http://10.17.17.129:8000/api');
