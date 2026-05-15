import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import AppStackNavigator from './AppStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="AuthFlow">
            <Stack.Screen name="AuthFlow" component={AuthStackNavigator} />
            <Stack.Screen name="AppFlow" component={AppStackNavigator} />
        </Stack.Navigator>
    );
};

export default RootStackNavigator;
