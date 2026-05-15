import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyResetCode'>;

export const VerifyResetCodeScreen = ({ navigation, route }: Props) => {
    const { colors, isDark } = useTheme();
    const { contactInfo } = route.params;
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (timer <= 0) {
            return;
        }
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

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
                        <Text style={[styles.title, { color: colors.text }]}>Verify Code</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}> 
                            Enter the 6-digit code sent to <Text style={[styles.boldText, { color: colors.text }]}>{contactInfo}</Text>.
                        </Text>

                        <TextInput
                            style={[styles.otpInput, { borderColor: colors.primary, color: colors.text, backgroundColor: colors.surface }]}
                            placeholder="000000"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                            autoFocus
                        />

                        <TouchableOpacity
                            style={[styles.mainBtn, { backgroundColor: otp.length === 6 ? colors.primary : colors.surface, marginTop: 24 }]}
                            disabled={otp.length !== 6}
                            onPress={() => navigation.navigate('ResetPassword', { contactInfo })}
                        >
                            <Text style={[styles.mainBtnText, { color: otp.length === 6 ? colors.textInverse : colors.textSecondary }]}>Verify Code</Text>
                        </TouchableOpacity>

                        <View style={styles.resendContainer}>
                            <Text style={{ color: colors.textSecondary }}>Did not receive the code? </Text>
                            <TouchableOpacity disabled={timer > 0} onPress={() => setTimer(30)}>
                                <Text style={{ color: timer > 0 ? colors.textSecondary : colors.primary, fontWeight: '700' }}>
                                    {timer > 0 ? `Resend in ${timer}s` : 'Resend Now'}
                                </Text>
                            </TouchableOpacity>
                        </View>
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
    boldText: { fontWeight: '700' },
    otpInput: { height: 72, borderWidth: 2, borderRadius: 16, textAlign: 'center', fontSize: 32, letterSpacing: 16, fontWeight: '900' },
    mainBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    mainBtnText: { fontSize: 16, fontWeight: '800' },
    resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});

export default VerifyResetCodeScreen;
