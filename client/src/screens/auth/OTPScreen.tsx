import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import OtpInputs from 'react-native-otp-molecule';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import type { AuthStackParamList } from '@/navigation/AuthStackNavigator';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const OTPScreen = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation<AuthNavigationProp>();
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
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.topInfo}>
                    <Text style={[styles.title, { color: colors.text }]}>Verify Phone</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        We sent a code to <Text style={{ color: colors.text, fontWeight: '700' }}>+234 ••• ••• 8829</Text>
                    </Text>
                </View>

                {/* react-native-otp-molecule Implementation */}
                <View style={styles.otpSection}>
                    <OtpInputs
                        inputsCount={6}
                        onSubmit={(otp) => {
                            console.log(otp);

                        }}
                    // handleChange={(code) => setOtpValue(code)}
                    // numberOfInputs={4}
                    // autofillFromClipboard={true}
                    // Custom Styling for Molecule
                    // inputContainerStyles={[styles.otpInputContainer, { backgroundColor: colors.surface }]}
                    // inputStyles={[styles.otpInputText, { color: colors.text }]}
                    // focusStyles={{ borderColor: colors.primary, borderWidth: 2 }}
                    />
                </View>

                <View style={styles.metaRow}>
                    <View style={styles.timerRow}>
                        <AppIcon library="Feather" name="clock" size={14} color={timer > 0 ? colors.textSecondary : colors.primary} />
                        <Text style={[styles.timerText, { color: timer > 0 ? colors.textSecondary : colors.primary }]}>
                            {timer > 0 ? formatTime(timer) : "Ready to resend"}
                        </Text>
                    </View>

                    <TouchableOpacity disabled={timer > 0} style={styles.resendBtn}>
                        <Text style={[styles.resendText, { color: timer > 0 ? colors.border : colors.primary }]}>
                            Resend Code
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonWrapper}>
                    <AppButton
                        title="Verify Account"
                        onPress={() => {
                            Keyboard.dismiss();
                            navigation.navigate('ResetPassword');
                        }}
                        disabled={otpValue.length !== 4}
                        style={{ height: 58, borderRadius: 18 }}
                    />
                </View>

                <View style={styles.infoFooter}>
                    <View style={[styles.shieldBg, { backgroundColor: colors.primary + '10' }]}>
                        <AppIcon library="Feather" name="shield" size={16} color={colors.primary} />
                    </View>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                        AfroSpot uses 256-bit encryption to keep your verification secure.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { height: 60, justifyContent: 'center', paddingHorizontal: 20 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },

    topInfo: { marginBottom: 40 },
    title: { fontSize: 32, fontWeight: '900', marginBottom: 12 },
    subtitle: { fontSize: 16, lineHeight: 24 },

    // Molecule Wrapper
    otpSection: {
        height: 100,
        marginBottom: 20,
        justifyContent: 'center',
    },
    otpInputContainer: {
        width: 65,
        height: 70,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'transparent', // Molecule handles focus border via focusStyles
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    otpInputText: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
    },

    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 4,
    },
    timerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    timerText: { fontSize: 14, fontWeight: '600' },
    resendBtn: { paddingVertical: 8 },
    resendText: { fontSize: 14, fontWeight: '800' },

    buttonWrapper: { marginBottom: 30 },

    infoFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    shieldBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: { flex: 1, fontSize: 12, lineHeight: 18, fontWeight: '500' },
});

export default OTPScreen;