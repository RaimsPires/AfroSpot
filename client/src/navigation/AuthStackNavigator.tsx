import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import LogInScreen from '@/screens/auth/LogInScreen';
import OTPScreen from '@/screens/auth/OTPScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ResetPasswordScreen from '@/screens/auth/ResetPasswordScreen';

export type AuthStackParamList = {
    LogIn: undefined;
    Register: undefined;
    OTP: undefined;
    ResetPassword: undefined;
    ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LogIn" component={LogInScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
};

export default AuthStackNavigator;
