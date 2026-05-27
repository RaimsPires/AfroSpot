import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import EmailVerificationPendingScreen from '@screens/auth/EmailVerificationPendingScreen';
import ForgotPasswordScreen from '@screens/auth/ForgotPasswordScreen';
import LogInScreen from '@screens/auth/LogInScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import ResetPasswordScreen from '@screens/auth/ResetPasswordScreen';

export type AuthStackParamList = {
    LogIn: undefined;
    Register: undefined;
    EmailVerificationPending: { email: string; password: string };
    ResetPassword:
        | {
              uid?: string;
              token?: string;
              email?: string;
          }
        | undefined;
    ForgotPassword:
        | {
              email?: string;
          }
        | undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LogIn" component={LogInScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="EmailVerificationPending" component={EmailVerificationPendingScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
};

export default AuthStackNavigator;
