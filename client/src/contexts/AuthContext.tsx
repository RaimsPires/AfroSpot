import React, { createContext, useContext, useMemo } from 'react';

import { useAuthStore } from '@store/authStore';
import { AuthPayload, AuthUser } from '@type/auth';

type AuthContextValue = {
    isAuthenticated: boolean;
    user: AuthUser | null;
    signIn: (payload: AuthPayload) => Promise<void>;  
    signOut: () => Promise<void>;
    signUp: (payload: any) => Promise<void>;
    setAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const signIn = useAuthStore((state) => state.signIn);
    const signOut = useAuthStore((state) => state.signOut);
    const signUp = useAuthStore((state) => state.signUp);
    const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

    const value = useMemo(
        () => ({
            isAuthenticated,
            user,
            signIn,
            signOut,
            signUp,
            setAuthenticated,
        }),
        [isAuthenticated, setAuthenticated, signIn, signOut, signUp, user],
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
