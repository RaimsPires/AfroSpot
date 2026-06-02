import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useAuth } from '@contexts/AuthContext';
import AuthCheckingScreen from '@screens/auth/AuthCheckingScreen';
import AppStackNavigator from './AppStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
        const { isAuthenticated, isAuthBootstrapping } = useAuth();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            {   isAuthBootstrapping ? (
                    // Show a loading screen while bootstrapping auth state
                    <Stack.Screen name="AppFlow" component={AuthCheckingScreen} />
                ) : isAuthenticated ? (
                    <Stack.Screen name="AppFlow" component={AppStackNavigator} />
                ) : (
                    <Stack.Screen name="AuthFlow" component={AuthStackNavigator} />
                )
            }
        </Stack.Navigator>
    );
};

export default RootStackNavigator;
