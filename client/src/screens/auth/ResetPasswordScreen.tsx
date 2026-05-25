import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const ResetPasswordScreen = () => {
    const { colors, isDark } = useTheme();
    const { resetPassword, loading } = useAuth();
    const navigation = useNavigation<AuthNavigationProp>();
    const route = useRoute();
    const routeParams = route.params as AuthStackParamList['ResetPassword'];
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const uid = routeParams?.uid;
    const token = routeParams?.token;
    const isValid = Boolean(uid && token) && password.length >= 8 && password === confirmPassword;

    const handlePasswordReset = () => {
        if (!uid || !token) {
            Alert.alert(
                'Invalid reset link',
                'This reset link is invalid or expired. Request a new one from Forgot Password.',
                [{ text: 'Go to Forgot Password', onPress: () => navigation.navigate('ForgotPassword') }],
            );
            return;
        }

        resetPassword({
            uid,
            token,
            new_password1: password,
            new_password2: confirmPassword,
        })
            .then(() => {
                Alert.alert('Password updated', 'Your password has been reset successfully.', [
                    { text: 'Go to Login', onPress: () => navigation.navigate('LogIn') },
                ]);
            })
            .catch((error) => {
                Alert.alert(
                    'Reset failed',
                    error?.response?.data?.detail ||
                        error?.response?.data?.token?.[0] ||
                        'Unable to reset password with this link.',
                );
            });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Strong passwords include a mix of letters, numbers, and symbols.
                </Text>
            </View>

            <KeyboardAvoidingView style={styles.form}>
                {/* New Password */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>NEW PASSWORD</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="lock" size={20} color={colors.textSecondary} />
                        <TextInput
                            secureTextEntry={!showPassword}
                            style={[styles.input, { color: colors.text }]}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            placeholderTextColor={colors.textSecondary}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <AppIcon library="Feather" name={showPassword ? "eye-off" : "eye"} size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm Password */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>CONFIRM NEW PASSWORD</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="shield-check" size={20} color={colors.textSecondary} />
                        <TextInput
                            secureTextEntry={!showPassword}
                            style={[styles.input, { color: colors.text }]}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="••••••••"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>
                </View>

                {/* Password Strength Indicator (UI Only) */}
                <View style={styles.strengthContainer}>
                    <Text style={[styles.strengthText, { color: colors.textSecondary }]}>Password Strength: <Text style={{ color: '#22C55E', fontWeight: '800' }}>Strong</Text></Text>
                    <View style={styles.strengthBarBg}>
                        <View style={[styles.strengthBarFill, { backgroundColor: '#22C55E', width: '85%' }]} />
                    </View>
                </View>

                <AppButton
                    title="Update Password"
                    onPress={handlePasswordReset}
                    loading={loading}
                    disabled={!isValid || loading}
                    style={styles.submitBtn}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 30, paddingTop: 60, marginBottom: 40 },
    title: { fontSize: 28, fontWeight: '900', marginBottom: 12 },
    subtitle: { fontSize: 15, lineHeight: 22 },
    form: { paddingHorizontal: 30 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 10 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16 },
    input: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '500' },
    strengthContainer: { marginBottom: 40, marginTop: 10 },
    strengthText: { fontSize: 12, marginBottom: 8 },
    strengthBarBg: { height: 4, width: '100%', backgroundColor: '#E5E7EB', borderRadius: 2 },
    strengthBarFill: { height: '100%', borderRadius: 2 },
    submitBtn: { height: 56, borderRadius: 16 }
});