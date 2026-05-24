import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@utils/storage_constances';

import AppStackNavigator from './AppStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import OnboardingNavigator from './OnboardingNavigator';

const AppNavigator = () => {
    const { isAuthenticated } = useAuth();
    const [phase, setPhase] = useState<'loading' | 'onboarding' | 'app'>('loading');

    useEffect(() => {
        const bootstrapApp = async () => {
            try {
                const onboardingCompleted = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
                setPhase(onboardingCompleted === 'true' ? 'app' : 'onboarding');
            } catch {
                setPhase('onboarding');
            }
        };

        bootstrapApp();
    }, []);

    const handleOnboardingComplete = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
        } catch {
            // Continue to app even if storage write fails.
        }
        setPhase('app');
    };

    return (
        <NavigationContainer>
            {phase === 'loading' ? (
                <View style={styles.loadingScreen} />
            ) : phase === 'onboarding' ? (
                <OnboardingNavigator onComplete={handleOnboardingComplete} />
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
