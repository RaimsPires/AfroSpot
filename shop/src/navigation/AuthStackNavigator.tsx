import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountChoiceScreen } from '@screens/auth/AccountChoiceScreen';
import { BusinessKYCScreen } from '@screens/auth/BusinessKYCScreen';
import { BusinessKYCSuccessScreen } from '@screens/auth/BusinessKYCSuccessScreen';
import AuthScreen from '@screens/auth/LoginScreen';
import ForgotPasswordScreen from '@screens/auth/password-recovery/ForgotPasswordScreen';
import PasswordResetSuccessScreen from '@screens/auth/password-recovery/PasswordResetSuccessScreen';
import ResetPasswordScreen from '@screens/auth/password-recovery/ResetPasswordScreen';
import VerifyResetCodeScreen from '@screens/auth/password-recovery/VerifyResetCodeScreen';
import { UserOnboardingScreen } from '@screens/onboarding/UserOnboardingScreen';
import { OrderFulfillmentScreen } from '@screens/orders/OrderFulfillmentScreen';
import React from 'react';

import SignUpScreen from '@screens/auth/SignUpScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
            <Stack.Screen name="AccountChoice" component={AccountChoiceScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="VerifyResetCode" component={VerifyResetCodeScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="PasswordResetSuccess" component={PasswordResetSuccessScreen} />
            <Stack.Screen name="BusinessKYCSuccess" component={BusinessKYCSuccessScreen} />
            <Stack.Screen name="UserOnboarding" component={UserOnboardingScreen} />
            <Stack.Screen name="BusinessKYC" component={BusinessKYCScreen} />
            <Stack.Screen name="OrderFulfillment" component={OrderFulfillmentScreen} />
        </Stack.Navigator>
    );
};

export default AuthStackNavigator;
