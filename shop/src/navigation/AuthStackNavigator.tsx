import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrderFulfillmentScreen } from '@screens/app/OrderFulfillmentScreen';
import { AuthScreen } from '@screens/auth/AuthScreen';
import { BusinessKYCScreen } from '@screens/auth/BusinessKYCScreen';
import { SignUpScreen } from '@screens/auth/SignUpScreen';
import ForgotPasswordScreen from '@screens/auth/password-recovery/ForgotPasswordScreen';
import PasswordResetSuccessScreen from '@screens/auth/password-recovery/PasswordResetSuccessScreen';
import ResetPasswordScreen from '@screens/auth/password-recovery/ResetPasswordScreen';
import VerifyResetCodeScreen from '@screens/auth/password-recovery/VerifyResetCodeScreen';
import { UserOnboardingScreen } from '@screens/onboarding/UserOnboardingScreen';
import React from 'react';

import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="VerifyResetCode" component={VerifyResetCodeScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="PasswordResetSuccess" component={PasswordResetSuccessScreen} />
            <Stack.Screen name="UserOnboarding" component={UserOnboardingScreen} />
            <Stack.Screen name="BusinessKYC" component={BusinessKYCScreen} />
            <Stack.Screen name="OrderFulfillment" component={OrderFulfillmentScreen} />
        </Stack.Navigator>
    );
};

export default AuthStackNavigator;
