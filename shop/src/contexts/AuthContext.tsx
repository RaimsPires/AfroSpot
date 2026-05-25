import { apiClient } from '@services/apiClient';
import React, { createContext, useContext, useMemo, useState } from 'react';

export type AuthUser = {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
};

type PasswordResetRequestPayload = {
    email: string;
};

type PasswordResetConfirmPayload = {
    uid: string;
    token: string;
    new_password1: string;
    new_password2: string;
};

type PasswordChangePayload = {
    old_password: string;
    new_password1: string;
    new_password2: string;
};

type AuthContextValue = {
    isAuthenticated: boolean;
    user: AuthUser | null;
    loading: boolean;
    signIn: (user?: Partial<AuthUser>) => Promise<void>;
    signOut: () => void;
    forgotPassword: (payload: PasswordResetRequestPayload) => Promise<void>;
    resetPassword: (payload: PasswordResetConfirmPayload) => Promise<void>;
    changePassword: (payload: PasswordChangePayload) => Promise<void>;
    setAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(false);

    const signIn = async (nextUser?: Partial<AuthUser>) => {
        setIsAuthenticated(true);
        if (nextUser) {
            setUser((prev) => ({
                id: prev?.id ?? nextUser.id ?? 'shop-user',
                email: nextUser.email ?? prev?.email ?? '',
                first_name: nextUser.first_name ?? prev?.first_name,
                last_name: nextUser.last_name ?? prev?.last_name,
            }));
        }
    };

    const signOut = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const setAuthenticated = (value: boolean) => {
        setIsAuthenticated(value);
        if (!value) {
            setUser(null);
        }
    };

    const forgotPassword = async ({ email }: PasswordResetRequestPayload) => {
        try {
            setLoading(true);
            await apiClient.post('/auth/password/reset/', { email: email.trim().toLowerCase() });
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (payload: PasswordResetConfirmPayload) => {
        try {
            setLoading(true);
            await apiClient.post('/auth/password/reset/confirm/', payload);
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (payload: PasswordChangePayload) => {
        try {
            setLoading(true);
            await apiClient.post('/auth/password/change/', payload);
        } finally {
            setLoading(false);
        }
    };

    const value = useMemo(
        () => ({
            isAuthenticated,
            user,
            loading,
            signIn,
            signOut,
            forgotPassword,
            resetPassword,
            changePassword,
            setAuthenticated,
        }),
        [isAuthenticated, loading, user],
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
