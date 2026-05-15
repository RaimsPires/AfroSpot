import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen = ({ navigation }: Props) => {
    const { colors, isDark } = useTheme();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const isValid = newPassword.length >= 8 && newPassword === confirmPassword;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.formContainer}>
                        <Text style={[styles.title, { color: colors.text }]}>Create New Password</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}> 
                            Your new password must be unique from previously used passwords and at least 8 characters long.
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>NEW PASSWORD</Text>
                            <View style={[styles.passwordWrap, { borderColor: colors.border }]}> 
                                <TextInput
                                    style={[styles.passwordInput, { color: colors.text }]}
                                    placeholder="Min. 8 characters"
                                    placeholderTextColor={colors.textSecondary}
                                    secureTextEntry={!showPassword}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={styles.eyeBtn}>
                                    <AppIcon library="Feather" name={showPassword ? 'eye' : 'eye-off'} size={20} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>CONFIRM NEW PASSWORD</Text>
                            <View style={[styles.passwordWrap, { borderColor: colors.border }]}> 
                                <TextInput
                                    style={[styles.passwordInput, { color: colors.text }]}
                                    placeholder="Confirm your password"
                                    placeholderTextColor={colors.textSecondary}
                                    secureTextEntry={!showPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.mainBtn, { backgroundColor: isValid ? colors.primary : colors.surface }]}
                            disabled={!isValid}
                            onPress={() => navigation.navigate('PasswordResetSuccess')}
                        >
                            <Text style={[styles.mainBtnText, { color: isValid ? colors.textInverse : colors.textSecondary }]}>Reset Password</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingVertical: 12 },
    iconBtn: { padding: 8, alignSelf: 'flex-start' },
    scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 60, flexGrow: 1, justifyContent: 'center' },
    formContainer: { width: '100%' },
    title: { fontSize: 32, fontWeight: '900', marginBottom: 12 },
    subtitle: { fontSize: 15, lineHeight: 24, marginBottom: 32 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
    passwordWrap: { flexDirection: 'row', alignItems: 'center', height: 56, borderWidth: 1, borderRadius: 16, paddingLeft: 16 },
    passwordInput: { flex: 1, fontSize: 16 },
    eyeBtn: { padding: 16 },
    mainBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    mainBtnText: { fontSize: 16, fontWeight: '800' },
});

export default ResetPasswordScreen;
