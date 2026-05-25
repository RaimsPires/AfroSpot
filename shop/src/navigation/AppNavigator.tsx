import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import React from 'react';

import RootStackNavigator from './RootStackNavigator';
import type { RootStackParamList } from './types';

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['afrospotshop://'],
    config: {
        screens: {
            AuthFlow: {
                screens: {
                    ForgotPassword: 'forgot-password',
                    ResetPassword: 'reset-password',
                },
            },
        },
    },
};

const AppNavigator = () => {
    return (
        <NavigationContainer linking={linking}>
            <RootStackNavigator />
        </NavigationContainer>
    );
};

export default AppNavigator;
