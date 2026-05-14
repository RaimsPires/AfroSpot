import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import AppStackNavigator from './AppStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';

type AppNavigatorProps = {
    isAuthenticated?: boolean;
};

const AppNavigator = ({ isAuthenticated = true }: AppNavigatorProps) => {
    return (
        <NavigationContainer>
            {isAuthenticated ? <AppStackNavigator /> : <AuthStackNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;
