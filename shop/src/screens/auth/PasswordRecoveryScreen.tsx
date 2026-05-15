import type { AuthStackParamList } from '@navigation/types';
import ForgotPasswordScreen from '@screens/auth/password-recovery/ForgotPasswordScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

// Legacy compatibility wrapper: keep existing imports working.
export const PasswordRecoveryScreen = (props: Props) => {
    return <ForgotPasswordScreen {...props} />;
};

export default PasswordRecoveryScreen;
