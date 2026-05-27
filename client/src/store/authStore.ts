import { createUserAddress, setPrimaryUserAddress, updateUserAddress } from '@services/addressService';
import { apiClient } from '@services/apiClient';
import { localeStorage } from '@services/localeStorage';
import { patchUserProfile } from '@services/profileService';
import {
    AuthPayload,
    AuthUser,
    CreateUserAddressPayload,
    LoginRequestResponse,
    PasswordChangePayload,
    PasswordResetConfirmPayload,
    PasswordResetRequestPayload,
    RegisterPayload,
    UpdateUserAddressPayload,
    UpdateUserProfilePayload,
    UserAddress,
} from '@type/auth';
import { STORAGE_KEYS } from '@utils/storage_constances';
import { create } from 'zustand';

type AuthState = {
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading?: boolean;
    isAuthBootstrapping: boolean;
    signIn: (payload: AuthPayload) => Promise<void>;
    signUp: (payload: RegisterPayload | FormData) => Promise<void>;
    checkEmailVerified: (email: string, password: string) => Promise<boolean>;
    signOut: () => Promise<void>;
    forgotPassword: (payload: PasswordResetRequestPayload) => Promise<void>;
    resetPassword: (payload: PasswordResetConfirmPayload) => Promise<void>;
    changePassword: (payload: PasswordChangePayload) => Promise<void>;
    updateProfile: (payload: UpdateUserProfilePayload) => Promise<AuthUser>;
    addAddress: (payload: CreateUserAddressPayload) => Promise<UserAddress>;
    updateAddress: (addressId: string, payload: UpdateUserAddressPayload) => Promise<UserAddress>;
    setPrimaryAddress: (addressId: string) => Promise<UserAddress>;
    bootstrapAuth: () => Promise<void>;
    setAuthenticated: (value: boolean) => void;
};

function getActiveAddressLabel(addresses: UserAddress[]): string | null {
    const activeAddress = addresses.find((address) => address.is_active);

    if (!activeAddress) {
        return null;
    }

    return `${activeAddress.address}, ${activeAddress.city}`;
}

async function persistUserProfile(user: AuthUser): Promise<void> {
    await localeStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
}

// --- Session Helpers ---

async function persistAuthSession(data: LoginRequestResponse): Promise<void> {
    await Promise.all([
        localeStorage.setEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN, data.access),
        localeStorage.setEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh),
        localeStorage.setEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRY, data.access_expiration),
        localeStorage.setEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRY, data.refresh_expiration),
        localeStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(data.user)),
    ]);
}

export async function clearAuthSession(): Promise<void> {
    await Promise.all([
        localeStorage.removeEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN),
        localeStorage.removeEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN),
        localeStorage.removeEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRY),
        localeStorage.removeEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRY),
        localeStorage.removeItem(STORAGE_KEYS.USER_PROFILE),
    ]);
}

// Returns true when the expiry ISO string is still in the future (30-second safety buffer)
function isTokenValid(expiry: string | null): boolean {
    if (!expiry) { return false; }
    return new Date(expiry).getTime() - 30_000 > Date.now();
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    isAuthBootstrapping: true,

    bootstrapAuth: async () => {
        try {
            set({ isAuthBootstrapping: true });

            const [accessToken, accessExpiry] = await Promise.all([
                localeStorage.getEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN),
                localeStorage.getEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRY),
            ]);

            if (!accessToken) {
                return; // Never logged in or session already cleared
            }

            if (isTokenValid(accessExpiry)) {
                // Token still valid — fetch fresh user from server
                try {
                    const response = await apiClient.get<AuthUser>('/auth/user/');
                    set({ isAuthenticated: true, user: response.data });
                    return;
                } catch {
                    // Server rejected token despite local expiry — fall through to refresh
                }
            }

            // Access token expired — attempt silent refresh
            const [refreshToken, refreshExpiry] = await Promise.all([
                localeStorage.getEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN),
                localeStorage.getEncryptedItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRY),
            ]);

            if (!refreshToken || !isTokenValid(refreshExpiry)) {
                await clearAuthSession();
                return;
            }

            try {
                const refreshResponse = await apiClient.post<{
                    access: string;
                    access_expiration: string;
                }>('/auth/token/refresh/', { refresh: refreshToken });

                await Promise.all([
                    localeStorage.setEncryptedItem(
                        STORAGE_KEYS.ACCESS_TOKEN,
                        refreshResponse.data.access,
                    ),
                    localeStorage.setEncryptedItem(
                        STORAGE_KEYS.ACCESS_TOKEN_EXPIRY,
                        refreshResponse.data.access_expiration,
                    ),
                ]);

                const userResponse = await apiClient.get<AuthUser>('/auth/user/');
                set({ isAuthenticated: true, user: userResponse.data });
            } catch {
                // Refresh failed — session is dead, force re-login
                await clearAuthSession();
            }
        } finally {
            set({ isAuthBootstrapping: false });
        }
    },

    signIn: async (login_data) => {
        try {
            set({ loading: true });
            const response = await apiClient.post<LoginRequestResponse>('/auth/login/', login_data);
            await persistAuthSession(response.data);
            set({
                isAuthenticated: true,
                user: response.data.user,
            });
        } catch (error) {
            console.error('Error during sign-in:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    signUp: async (signup_data) => {
        try {
            set({ loading: true });
            const isFormData = signup_data instanceof FormData;
            await apiClient.post(
                '/auth/registration/',
                signup_data,
                isFormData
                    ? { headers: { Accept: 'application/json', 'Content-Type': 'multipart/form-data' } }
                    : undefined,
            );
            // Registration sends a verification email — no session tokens are returned yet.
        } catch (error) {
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    checkEmailVerified: async (email, password) => {
        try {
            const response = await apiClient.post<LoginRequestResponse>('/auth/login/', {
                login_id: email,
                password,
            });
            // Login succeeded → email is verified, persist the session
            await persistAuthSession(response.data);
            set({ isAuthenticated: true, user: response.data.user });
            return true;
        } catch (error: any) {
            // 400/401 with an "email not confirmed" message means not yet verified
            const data = error?.response?.data;
            const message: string =
                data?.non_field_errors?.[0] ||
                data?.detail ||
                data?.message ||
                '';
            if (
                message.toLowerCase().includes('e-mail') ||
                message.toLowerCase().includes('email') ||
                message.toLowerCase().includes('confirm') ||
                message.toLowerCase().includes('verif')
            ) {
                return false;
            }
            // Unexpected error (network, server) — re-throw so callers can handle it
            throw error;
        }
    },

    signOut: async () => {
        try {
            await apiClient.post('/auth/logout/');
        } catch (error) {
            console.error('Error during sign-out:', error);
            // Ignore network errors — clear local session regardless
        } finally {
            await clearAuthSession();
            set({ isAuthenticated: false, user: null });
        }
    },

    forgotPassword: async ({ email }) => {
        try {
            set({ loading: true });
            await apiClient.post('/auth/password/reset/', {
                email: email.trim().toLowerCase(),
            });
        } catch (error) {
            console.error('Error during password reset request:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    resetPassword: async (payload) => {
        try {
            set({ loading: true });
            await apiClient.post('/auth/password/reset/confirm/', payload);
        } catch (error) {
            console.error('Error while resetting password:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    changePassword: async (payload) => {
        try {
            set({ loading: true });
            await apiClient.post('/auth/password/change/', payload);
        } catch (error) {
            console.error('Error while changing password:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    updateProfile: async (payload) => {
        try {
            set({ loading: true });
            const updatedUser = await patchUserProfile(payload);
            apiClient.setLocale(updatedUser.language);
            set((state) => ({
                ...state,
                user: updatedUser,
            }));
            await persistUserProfile(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Error while updating user profile:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    addAddress: async (payload) => {
        try {
            set({ loading: true });
            const newAddress = await createUserAddress(payload);

            let updatedUser: AuthUser | null = null;
            set((state) => {
                if (!state.user) {
                    return state;
                }

                const existingAddresses = state.user.addresses.filter(
                    (address) => address.id !== newAddress.id,
                );

                updatedUser = {
                    ...state.user,
                    addresses: [newAddress, ...existingAddresses].map((address) => ({
                        ...address,
                        is_active: newAddress.is_active ? address.id === newAddress.id : address.is_active,
                    })),
                };

                updatedUser.active_address = getActiveAddressLabel(updatedUser.addresses);

                return {
                    ...state,
                    user: updatedUser,
                };
            });

            if (updatedUser) {
                await persistUserProfile(updatedUser);
            }

            return newAddress;
        } catch (error) {
            console.error('Error while adding user address:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    updateAddress: async (addressId, payload) => {
        try {
            set({ loading: true });
            const updatedAddress = await updateUserAddress(addressId, payload);

            let updatedUser: AuthUser | null = null;
            set((state) => {
                if (!state.user) {
                    return state;
                }

                const hasTargetAddress = state.user.addresses.some((address) => address.id === updatedAddress.id);
                const addresses = hasTargetAddress
                    ? state.user.addresses
                    : [updatedAddress, ...state.user.addresses];

                updatedUser = {
                    ...state.user,
                    addresses: addresses.map((address) => {
                        if (address.id === updatedAddress.id) {
                            return updatedAddress;
                        }

                        return {
                            ...address,
                            is_active: updatedAddress.is_active ? false : address.is_active,
                        };
                    }),
                };

                updatedUser.active_address = getActiveAddressLabel(updatedUser.addresses);

                return {
                    ...state,
                    user: updatedUser,
                };
            });

            if (updatedUser) {
                await persistUserProfile(updatedUser);
            }

            return updatedAddress;
        } catch (error) {
            console.error('Error while updating user address:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    setPrimaryAddress: async (addressId) => {
        try {
            set({ loading: true });
            const primaryAddress = await setPrimaryUserAddress(addressId);

            let updatedUser: AuthUser | null = null;
            set((state) => {
                if (!state.user) {
                    return state;
                }

                const hasTargetAddress = state.user.addresses.some((address) => address.id === primaryAddress.id);
                const addresses = hasTargetAddress
                    ? state.user.addresses
                    : [primaryAddress, ...state.user.addresses];

                updatedUser = {
                    ...state.user,
                    addresses: addresses.map((address) => {
                        if (address.id === primaryAddress.id) {
                            return primaryAddress;
                        }

                        return {
                            ...address,
                            is_active: false,
                        };
                    }),
                };

                updatedUser.active_address = getActiveAddressLabel(updatedUser.addresses);

                return {
                    ...state,
                    user: updatedUser,
                };
            });

            if (updatedUser) {
                await persistUserProfile(updatedUser);
            }

            return primaryAddress;
        } catch (error) {
            console.error('Error while setting primary address:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    setAuthenticated: (value) =>
        set((state) => ({
            isAuthenticated: value,
            user: value ? state.user : null,
        })),
}));
