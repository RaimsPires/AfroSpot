import React, { createContext, useContext, useEffect, useMemo } from 'react';

import { useAuthStore } from '@store/authStore';
import {
    AuthPayload,
    AuthUser,
    PasswordChangePayload,
    PasswordResetConfirmPayload,
    PasswordResetRequestPayload,
} from '@type/auth';

type AuthContextValue = {
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading?: boolean;
    isAuthBootstrapping: boolean;
    signIn: (payload: AuthPayload) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (payload: any) => Promise<void>;
    forgotPassword: (payload: PasswordResetRequestPayload) => Promise<void>;
    resetPassword: (payload: PasswordResetConfirmPayload) => Promise<void>;
    changePassword: (payload: PasswordChangePayload) => Promise<void>;
    setAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const signIn = useAuthStore((state) => state.signIn);
    const signOut = useAuthStore((state) => state.signOut);
    const signUp = useAuthStore((state) => state.signUp);
    const forgotPassword = useAuthStore((state) => state.forgotPassword);
    const resetPassword = useAuthStore((state) => state.resetPassword);
    const changePassword = useAuthStore((state) => state.changePassword);
    const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
    const loading = useAuthStore((state) => state.loading);
    const isAuthBootstrapping = useAuthStore((state) => state.isAuthBootstrapping);
    const bootstrapAuth = useAuthStore((state) => state.bootstrapAuth);

    useEffect(() => {
        bootstrapAuth().catch((error) => {
            console.error('[Auth] Bootstrap failed:', error);
        });
    }, [bootstrapAuth]);

    const value = useMemo(
        () => ({
            isAuthenticated,
            user,
            loading,
            isAuthBootstrapping,
            signIn,
            signOut,
            signUp,
            forgotPassword,
            resetPassword,
            changePassword,
            setAuthenticated,
        }),
        [
            isAuthenticated,
            isAuthBootstrapping,
            setAuthenticated,
            signIn,
            signOut,
            signUp,
            forgotPassword,
            resetPassword,
            changePassword,
            user,
            loading,
        ],
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
