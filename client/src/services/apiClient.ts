import { localeStorage } from '@services/localeStorage';
import { STORAGE_KEYS } from '@utils/storage_constances';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Extend Axios config to track retries internally
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retryCount?: number;
    _isAuthRefresh?: boolean; // Prevents infinite 401 → refresh → 401 loops
}

class ApiClient {
    private api: AxiosInstance;
    private pendingRequests: Map<string, Promise<any>>; // For Deduplication
    private locale: string;

    constructor(baseURL: string) {
        this.pendingRequests = new Map();
        this.locale = 'en';

        this.api = axios.create({
            baseURL,
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        this.initializeInterceptors();
        this.initializeLocaleFromStorage().catch((error) => {
            console.error('[API] Locale initialization failed:', error);
            this.setLocale('en');
        });
    }

    public setLocale(locale?: string | null) {
        this.locale = locale || 'en';
    }

    // --- Silent Token Refresh ---
    // Returns true and saves the new access token when refresh succeeds.
    // Returns false if the refresh token is missing, expired, or the server rejects it.
    private async tryRefreshToken(): Promise<boolean> {
        try {
            const [refreshToken, refreshExpiry] = await Promise.all([
                localeStorage.getEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN),
                localeStorage.getEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRY),
            ]);

            if (!refreshToken) { return false; }

            const expiryMs = refreshExpiry ? new Date(refreshExpiry).getTime() - 30_000 : 0;
            if (expiryMs <= Date.now()) { return false; }

            const response = await this.api.post<{
                access: string;
                access_expiration: string;
            }>('/auth/token/refresh/', { refresh: refreshToken }, {
                _isAuthRefresh: true,
            } as CustomAxiosRequestConfig);

            await Promise.all([
                localeStorage.setEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access),
                localeStorage.setEncryptedItem(
                    STORAGE_KEYS.ACCESS_TOKEN_EXPIRY,
                    response.data.access_expiration,
                ),
            ]);

            return true;
        } catch {
            return false;
        }
    }

    private async initializeLocaleFromStorage() {
        try {
            const encryptedLocale = await localeStorage.getEncryptedItem(STORAGE_KEYS.APP_LOCALE);

            if (encryptedLocale) {
                this.setLocale(encryptedLocale);
                return;
            }

            const asyncLocale = await localeStorage.getItem(STORAGE_KEYS.APP_LOCALE);

            if (asyncLocale) {
                await localeStorage.setEncryptedItem(STORAGE_KEYS.APP_LOCALE, asyncLocale);
            }

            this.setLocale(asyncLocale);
        } catch (error) {
            console.error('[API] Error initializing locale:', error);
            this.setLocale('en');
        }
    }

    // --- 1. Deduplication Helper ---
    // Creates a unique hash for a request so we can spot duplicates
    private generateRequestKey(method: string, url: string, data?: any, params?: any): string {
        return `${method}:${url}:${JSON.stringify(data || {})}:${JSON.stringify(params || {})}`;
    }

    private initializeInterceptors() {
        // --- 2. REQUEST INTERCEPTOR (Headers & Locale) ---
        this.api.interceptors.request.use(
            async (config) => {
                try {
                    const token = await localeStorage.getEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN);

                    if (config.headers) {
                        if (token) config.headers.Authorization = `Bearer ${token}`;
                        // Inject Locale (Fallback to English if nothing is saved)
                        config.headers['Accept-Language'] = this.locale;
                    }
                } catch (error) {
                    console.error('[API] Error reading storage:', error);
                }
                return config;
            },
            (error: AxiosError) => Promise.reject(error)
        );

        // --- 3. RESPONSE INTERCEPTOR (Success, Errors, Retries) ---
        this.api.interceptors.response.use(
            (response: AxiosResponse) => {
                // --- Manage Success Response ---
                // You can dispatch a Redux action here, or log successful mutations
                if (response.config.method !== 'get') {
                    console.log(`[API Success] ${response.config.method?.toUpperCase()} ${response.config.url} completed.`);
                }
                return response;
            },
            async (error: AxiosError) => {
                const config = error.config as CustomAxiosRequestConfig;

                // --- A. Automatic Retry Logic (For Network or 5xx Errors) ---
                const isNetworkError = error.message === 'Network Error';
                const isServerError = error.response && error.response.status >= 500;

                if ((isNetworkError || isServerError) && config) {
                    config._retryCount = config._retryCount || 0;
                    const MAX_RETRIES = 3;

                    if (config._retryCount < MAX_RETRIES) {
                        config._retryCount += 1;

                        // Exponential backoff delay (1s, 2s, 3s...)
                        const delay = 1000 * config._retryCount;
                        console.warn(`[API Retry] ${config.url} failed. Retrying in ${delay}ms... (${config._retryCount}/${MAX_RETRIES})`);

                        await new Promise<void>((resolve) => setTimeout(resolve, delay));
                        return this.api.request(config); // Resend the request
                    }
                }

                // --- B. Global Error Management ---
                if (error.response) {
                    const status = error.response.status;
                    const errorMessage = (error.response.data as any)?.message || 'An error occurred';

                    switch (status) {
                        case 401:
                            // Try silent token refresh once before giving up
                            if (!config._isAuthRefresh) {
                                const refreshed = await this.tryRefreshToken();
                                if (refreshed) {
                                    const newToken = await localeStorage.getEncryptedItem(
                                        STORAGE_KEYS.ACCESS_TOKEN,
                                    );
                                    config._isAuthRefresh = true;
                                    if (config.headers && newToken) {
                                        config.headers.Authorization = `Bearer ${newToken}`;
                                    }
                                    return this.api.request(config);
                                }
                            }
                            // Refresh failed or this was the refresh request — clear session
                            console.warn('[API 401] Session expired. Clearing auth.');
                            await Promise.all([
                                localeStorage.removeEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN),
                                localeStorage.removeEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN),
                                localeStorage.removeEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRY),
                                localeStorage.removeEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRY),
                                localeStorage.removeItem(STORAGE_KEYS.USER_PROFILE),
                            ]);
                            break;
                        case 403:
                            console.error('[API 403] Forbidden. User lacks permissions.');
                            break;
                        case 404:
                            console.error(`[API 404] Resource not found: ${config.url}`);
                            break;
                        case 422:
                            console.error('[API 422] Validation Error:', error.response.data);
                            break;
                        default:
                            if (status < 500) {
                                console.error(`[API ${status}] Client Error:`, errorMessage);
                            } else {
                                console.error(`[API ${status}] Server Error. Team notified.`);
                            }
                    }
                } else if (isNetworkError) {
                    console.error('[API Network] No internet connection.');
                }

                return Promise.reject(error);
            }
        );
    }

    // --- 4. PUBLIC API WRAPPERS (With Deduplication) ---

    private executeWithDeduplication<T>(
        method: string,
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        const key = this.generateRequestKey(method, url, data, config?.params);

        // If the exact same request is currently in progress, return the existing Promise
        // instead of firing a brand new network request.
        if (this.pendingRequests.has(key)) {
            console.log(`[API Deduplication] Intercepted duplicate request to ${url}. Joining existing request.`);
            return this.pendingRequests.get(key) as Promise<AxiosResponse<T>>;
        }

        // Fire the real request
        let requestPromise;
        if (method === 'get' || method === 'delete') {
            requestPromise = this.api[method]<T>(url, config);
        } else {
            // @ts-ignore
            requestPromise = this.api[method]<T>(url, data, config);
        }

        // When the request finishes (success or fail), remove it from the pending Map
        const promiseWithCleanup = requestPromise.finally(() => {
            this.pendingRequests.delete(key);
        });

        this.pendingRequests.set(key, promiseWithCleanup);
        return promiseWithCleanup;
    }

    public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.executeWithDeduplication<T>('get', url, null, config);
    }

    public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.executeWithDeduplication<T>('post', url, data, config);
    }

    public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.executeWithDeduplication<T>('put', url, data, config);
    }

    public patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.executeWithDeduplication<T>('patch', url, data, config);
    }

    public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.executeWithDeduplication<T>('delete', url, null, config);
    }
}

export const apiClient = new ApiClient('http://192.168.1.105:8000/api');