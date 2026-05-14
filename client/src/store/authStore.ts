import { create } from 'zustand';

export type AuthUser = {
    id: string;
    name: string;
    email: string;
};

type AuthState = {
    isAuthenticated: boolean;
    user: AuthUser | null;
    signIn: (user?: Partial<AuthUser>) => void;
    signOut: () => void;
    setAuthenticated: (value: boolean) => void;
};

const STATIC_USER: AuthUser = {
    id: '1',
    name: 'Amara Okoro',
    email: 'amara@example.com',
};

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    signIn: (user) =>
        set({
            isAuthenticated: true,
            user: {
                ...STATIC_USER,
                ...user,
            },
        }),
    signOut: () =>
        set({
            isAuthenticated: false,
            user: null,
        }),
    setAuthenticated: (value) =>
        set((state) => ({
            isAuthenticated: value,
            user: value ? state.user ?? STATIC_USER : null,
        })),
}));
