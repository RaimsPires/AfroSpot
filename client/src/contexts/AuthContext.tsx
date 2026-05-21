import React, { createContext, useContext, useMemo } from 'react';

import type { AuthUser } from '@store/authStore';
import { useAuthStore } from '@store/authStore';

type AuthContextValue = {
    isAuthenticated: boolean;
    user: AuthUser | null;
    signIn: (user?: Partial<AuthUser>) => void;
    signOut: () => void;
    setAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const signIn = useAuthStore((state) => state.signIn);
    const signOut = useAuthStore((state) => state.signOut);
    const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

    const value = useMemo(
        () => ({
            isAuthenticated,
            user,
            signIn,
            signOut,
            setAuthenticated,
        }),
        [isAuthenticated, setAuthenticated, signIn, signOut, user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
