import { apiClient } from '@services/apiClient';
import { AuthPayload, AuthUser, LoginRequestResponse } from '@type/auth';
import { create } from 'zustand';



type AuthState = {
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading?: boolean;
    signIn: (payload: AuthPayload) => Promise<void>;
    signUp: (payload: AuthPayload) => Promise<void>;
    signOut: () => Promise<void>;
    setAuthenticated: (value: boolean) => void;
};


export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    signIn: async (login_data) => {
        try {
            set({ loading: true });
            const response = await apiClient.post<LoginRequestResponse>('/auth/login/', login_data);
            set({
                isAuthenticated: true,
                user: response.data.user,
            });
        } catch (error) {
            console.error('Error during sign-in:', error);
            throw error;
        }finally {
            set({ loading: false });
        }
    },
    signUp: async (signup_data) => {
        try {
            const response = await apiClient.post<LoginRequestResponse>('/auth/register/', signup_data);
            set({
                isAuthenticated: true,
                user: response.data.user,
            });
        } catch (error) {
            console.error('Error during sign-up:', error);
            throw error;
        }finally {
            set({ loading: false });
        }
    },
    signOut: async () => {
        try {
            await apiClient.post('/auth/logout/');
            set({
                isAuthenticated: false,
                user: null,
            });
        } catch (error) {
            set({
                isAuthenticated: false,
                user: null,
            });
            console.error('Error during sign-out:', error);
            throw error;
        }
    },
    setAuthenticated: (value) =>
        set((state) => ({
            isAuthenticated: value,
            user: value ? state.user : null,
        })),
}));
