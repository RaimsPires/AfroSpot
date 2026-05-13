import { OTPInput } from 'input-otp-native';
import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const OTPScreen = () => {
    const { colors, spacing, isDark } = useTheme();
    const [timer, setTimer] = useState(59);
    const [otpValue, setOtpValue] = useState('');

    // Countdown Timer Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Verification</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="search" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="bell" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                {/* Verification Icon Badge */}
                <View style={styles.iconCircleContainer}>
                    <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                        <AppIcon library="Feather" name="shield" size={32} color={colors.primary} />
                    </View>
                </View>

                <Text style={[styles.title, { color: colors.text }]}>Enter Verification Code</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    We've sent a 4-digit code to <Text style={[styles.boldText, { color: colors.text }]}>+234 ••• ••• 8829</Text>
                </Text>

                {/* OTP Input Section */}
                <View style={[styles.otpWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <OTPInput
                        style={styles.otpContainer}
                        autoFocus
                        maxLength={4}
                        value={otpValue}
                        onChange={setOtpValue}
                        onComplete={(value) => console.log(`OTP is ${value}`)}
                    />
                </View>

                {/* Timer Badge */}
                <View style={[styles.timerBadge, { backgroundColor: colors.surface }]}>
                    <AppIcon library="Feather" name="clock" size={14} color={colors.primary} />
                    <Text style={[styles.timerText, { color: colors.text }]}>{formatTime(timer)}</Text>
                </View>

                <View style={styles.resendContainer}>
                    <Text style={[styles.resendLabel, { color: colors.textSecondary }]}>Didn't receive code?</Text>
                    <TouchableOpacity disabled={timer > 0}>
                        <Text style={[styles.resendLink, { color: timer > 0 ? colors.border : colors.primary }]}>
                            Resend Code
                        </Text>
                    </TouchableOpacity>
                </View>

                <AppButton
                    title="Verify and Continue"
                    onPress={() => Keyboard.dismiss()}
                    rightIcon="arrow-right"
                    style={{ marginTop: spacing(2) }}
                />

                <View style={styles.secureFooter}>
                    <AppIcon library="Feather" name="lock" size={12} color={colors.textSecondary} />
                    <Text style={[styles.secureText, { color: colors.textSecondary }]}>
                        SECURE VERIFICATION BY AFROSPOT
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 56,
    },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerRight: { flexDirection: 'row', gap: 12 },
    iconBtn: { padding: 4 },
    content: { flex: 1, padding: 24, alignItems: 'center' },
    iconCircleContainer: { marginBottom: 32 },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { fontSize: 24, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 40, paddingHorizontal: 20 },

    // OTP Library Styles
    otpWrapper: {
        width: '100%',
        height: 75,
        paddingHorizontal: 10,
        marginBottom: 32,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 75,
        paddingHorizontal: 10,
    },
    otpPinContainer: {
        width: 65,
        borderColor: 'red',
        height: 75,
        borderRadius: 16,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpPinText: {
        fontSize: 28,
        fontWeight: '700',
    },
    boldText: {
        fontWeight: '700',
    },

    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 24,
    },
    timerText: { fontSize: 14, fontWeight: '700' },
    resendContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 32 },
    resendLabel: { fontSize: 14 },
    resendLink: { fontSize: 14, fontWeight: '700' },
    secureFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 24 },
    secureText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
});

export default OTPScreen;