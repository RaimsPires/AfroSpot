import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import RootStackNavigator from './RootStackNavigator';

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <RootStackNavigator />
        </NavigationContainer>
    );
};

export default AppNavigator;
