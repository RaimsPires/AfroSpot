import CookieManager from '@preeternal/react-native-cookie-manager';
import axios from 'axios';
import { Platform } from 'react-native';

class HttpClient {
    constructor(baseURL) {
        this.baseURL = baseURL;

        this.api = axios.create({
            baseURL: this.baseURL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            xsrfCookieName: null,
            xsrfHeaderName: null,
        });

        this.pendingRequests = new Map();
        this.isRefreshing = false;
        this.refreshSubscribers = [];
        this.onAuthFailure = null;

        this._initializeInterceptors();
    }

    setLogoutCallback(callback) {
        this.onAuthFailure = callback;
    }

    // Helper to wipe cookies securely on logout
    async clearSession() {
        try {
            await CookieManager.clearAll();
        } catch (error) {
            console.warn('Failed to clear cookies natively', error);
        }
    }

    _initializeInterceptors() {
        // --- REQUEST INTERCEPTOR: Manually inject cookies ---
        this.api.interceptors.request.use(async (config) => {
            try {
                // Fetch cookies natively for our API domain
                const cookies = await CookieManager.get(this.baseURL);

                // Format them into standard HTTP Cookie string: "key=value; key2=value2"
                const cookieString = Object.keys(cookies)
                    .map((key) => `${key}=${cookies[key].value}`)
                    .join('; ');

                if (cookieString) {
                    config.headers.Cookie = cookieString;
                }
            } catch (error) {
                console.warn('Failed to read cookies natively', error);
            }

            return config;
        });

        // --- RESPONSE INTERCEPTOR: Handle responses, Android flush, and errors ---
        this.api.interceptors.response.use(
            async (response) => {
                // Fix Android bug where OkHttp delays writing cookies to persistent storage
                if (Platform.OS === 'android') {
                    await CookieManager.flush();
                }
                return response.data;
            },
            async (error) => {
                // Also flush on Android if the request errored but returned headers (e.g., a 401)
                if (Platform.OS === 'android' && error.response) {
                    await CookieManager.flush();
                }

                const originalRequest = error.config;

                // 1. Smart Retries
                originalRequest._retryCount = originalRequest._retryCount || 0;
                const maxRetries = 2;

                if (this._shouldRetry(error) && originalRequest._retryCount < maxRetries) {
                    originalRequest._retryCount++;
                    const delay = Math.pow(2, originalRequest._retryCount) * 1000;
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    return this.api(originalRequest);
                }

                // 2. 401 Token Refresh Queue
                if (error.response?.status === 401 && !originalRequest._isRetry) {
                    if (this.isRefreshing) {
                        return new Promise((resolve, reject) => {
                            this.refreshSubscribers.push((err) => {
                                if (err) return reject(err);
                                resolve(this.api(originalRequest));
                            });
                        });
                    }

                    originalRequest._isRetry = true;
                    this.isRefreshing = true;

                    try {
                        // Manually fetch/attach cookies for the refresh call
                        // using a fresh axios instance to bypass interceptors
                        const cookies = await CookieManager.get(this.baseURL);
                        const refreshCookieString = Object.keys(cookies)
                            .map((key) => `${key}=${cookies[key].value}`)
                            .join('; ');

                        await axios.post(`${this.baseURL}/auth/refresh/`, {}, {
                            withCredentials: true,
                            headers: {
                                Cookie: refreshCookieString
                            }
                        });

                        if (Platform.OS === 'android') {
                            await CookieManager.flush();
                        }

                        this.isRefreshing = false;
                        this._onRefreshed(null);

                        return this.api(originalRequest);
                    } catch (refreshError) {
                        this.isRefreshing = false;
                        this._onRefreshed(refreshError);

                        // Token is dead. Clear cookies and trigger logout navigation.
                        await this.clearSession();
                        if (this.onAuthFailure) {
                            this.onAuthFailure();
                        }

                        return Promise.reject(this._formatError(refreshError));
                    }
                }

                // 3. Global Error Normalization
                return Promise.reject(this._formatError(error));
            }
        );
    }

    // --- Request Deduplication ---
    async request(config) {
        if (config.force) {
            return this.api(config);
        }

        const key = this._generateRequestKey(config);

        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key);
        }

        const promise = this.api(config).finally(() => {
            this.pendingRequests.delete(key);
        });

        this.pendingRequests.set(key, promise);
        return promise;
    }

    get(url, config = {}) { return this.request({ ...config, method: 'get', url }); }
    post(url, data, config = {}) { return this.request({ ...config, method: 'post', url, data }); }
    put(url, data, config = {}) { return this.request({ ...config, method: 'put', url, data }); }
    delete(url, config = {}) { return this.request({ ...config, method: 'delete', url }); }

    _generateRequestKey(config) {
        const { method, url, params, data } = config;
        return `${method}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`;
    }

    _shouldRetry(error) {
        const isNetworkError = !error.response;
        const isServerError = error.response && error.response.status >= 500;
        return isNetworkError || isServerError;
    }

    _onRefreshed(error) {
        this.refreshSubscribers.forEach((cb) => cb(error));
        this.refreshSubscribers = [];
    }

    _formatError(error) {
        if (error.response) {
            return {
                status: error.response.status,
                message: error.response.data?.detail || error.response.data?.message || "An error occurred",
                data: error.response.data
            };
        } else if (error.request) {
            return { status: 0, message: "Network error. Please check your connection." };
        }
        return { status: null, message: error.message };
    }
}

const API_URL = Platform.OS === 'ios' ? 'http://localhost:8000/api' : 'http://10.0.2.2:8000/api';
export const http = new HttpClient(API_URL);