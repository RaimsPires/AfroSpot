import { useAuth } from '@contexts/AuthContext';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { localeStorage } from '@services/localeStorage';
import { STORAGE_KEYS } from '@utils/storage_constances';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AuthCheckingScreen from '@screens/auth/AuthCheckingScreen';
import AppStackNavigator from './AppStackNavigator';
import type { AuthStackParamList } from './AuthStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import OnboardingNavigator from './OnboardingNavigator';

const linking: LinkingOptions<AuthStackParamList> = {
    // Support both host-based deep links (afrospot://reset-password?uid=...)
    // and path-based links (afrospot://login, afrospot://forgot-password).
    prefixes: ['afrospot://reset-password', 'afrospot://'],
    config: {
        screens: {
            LogIn: 'login',
            ForgotPassword: {
                path: 'forgot-password',
                parse: {
                    email: (value: string) => value,
                },
            },
            ResetPassword: {
                // Empty path here pairs with the host-based prefix above.
                path: '',
                parse: {
                    uid: (value: string) => value,
                    token: (value: string) => value,
                    email: (value: string) => value,
                },
            },
        },
    },
};

const AppNavigator = () => {
    const { isAuthenticated, isAuthBootstrapping } = useAuth();
    const [phase, setPhase] = useState<'loading' | 'onboarding' | 'app'>('loading');

    useEffect(() => {
        const bootstrapApp = async () => {
            try {
                const onboardingCompleted = await localeStorage.getItem(
                    STORAGE_KEYS.ONBOARDING_COMPLETED,
                );
                setPhase(onboardingCompleted === 'true' ? 'app' : 'onboarding');
            } catch {
                setPhase('onboarding');
            }
        };

        bootstrapApp();
    }, []);

    const handleOnboardingComplete = async () => {
        try {
            await localeStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
        } catch {
            // Continue to app even if storage write fails.
        }
        setPhase('app');
    };

    return (
        <NavigationContainer linking={linking}>
            {phase === 'loading' ? (
                <View style={styles.loadingScreen} />
            ) : phase === 'onboarding' ? (
                <OnboardingNavigator onComplete={handleOnboardingComplete} />
            ) : isAuthBootstrapping ? (
                <AuthCheckingScreen />
            ) : isAuthenticated ? (
                <AppStackNavigator />
            ) : (
                <AuthStackNavigator />
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;

const styles = StyleSheet.create({
    loadingScreen: {
        flex: 1,
        backgroundColor: '#000000',
    },
});
