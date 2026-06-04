import { AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiClient } from '@services/apiClient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    AppState,
    AppStateStatus,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

// How often (ms) the screen polls while it's in the foreground
const POLL_INTERVAL_MS = 8_000;
// Resend countdown duration (seconds)
const RESEND_COOLDOWN_S = 60;

function maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) { return email; }
    return `${local[0]}${'*'.repeat(Math.max(local.length - 1, 2))}@${domain}`;
}

interface BusinessEmailVerificationParams {
    email: string;
    businessName: string;
    verificationKey?: string;
}

const BusinessEmailVerificationScreen = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation<AuthNavigationProp>();
    const route = useRoute();
    const { email, businessName, verificationKey } = (route.params as BusinessEmailVerificationParams);

    // ── UI state ──────────────────────────────────────────────────────────────
    const [isChecking, setIsChecking] = useState(false);
    const [notVerifiedMsg, setNotVerifiedMsg] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN_S);
    const [isSendingResend, setIsSendingResend] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [verificationError, setVerificationError] = useState<string | null>(null);

    // ── Refs (so callbacks always close over latest values without re-creating) ─
    const isVerifiedRef = useRef(false);
    const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const notVerifiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Core: run a verification check and navigate if verified ───────────────
    const runCheck = useCallback(
        async (silent = false) => {
            if (isVerifiedRef.current) { return; }
            if (!silent) { setIsChecking(true); }
            try {
                // Try to verify with the API endpoint
                // The API will check if the email is verified via the EmailVerification model
                const response = await apiClient.post('/spots/check-business-registration-status/', {
                    email: email.toLowerCase(),
                });

                if (response.data?.is_email_verified) {
                    isVerifiedRef.current = true;
                    // Clear polling now so no race conditions
                    if (pollTimerRef.current) { clearInterval(pollTimerRef.current); }
                    // Navigate to AppFlow since business + user are now ready
                    navigation.replace('AppFlow');
                } else if (!silent) {
                    // User tapped the button but email is not yet verified
                    setNotVerifiedMsg(true);
                    notVerifiedTimerRef.current = setTimeout(() => setNotVerifiedMsg(false), 3_000);
                }
            } catch (error: any) {
                setVerificationError(error?.response?.data?.detail || 'Error checking verification status');
                if (!silent) {
                    notVerifiedTimerRef.current = setTimeout(() => setVerificationError(null), 3_000);
                }
            } finally {
                if (!silent) { setIsChecking(false); }
            }
        },
        [email, navigation],
    );

    // ── Background → Foreground: fire a check whenever app resumes ───────────
    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextState: AppStateStatus) => {
                if (nextState === 'active') {
                    runCheck(true);
                }
            },
        );
        return () => subscription.remove();
    }, [runCheck]);

    // ── Interval polling while screen is mounted ──────────────────────────────
    useEffect(() => {
        pollTimerRef.current = setInterval(() => runCheck(true), POLL_INTERVAL_MS);
        return () => {
            if (pollTimerRef.current) { clearInterval(pollTimerRef.current); }
            if (notVerifiedTimerRef.current) { clearTimeout(notVerifiedTimerRef.current); }
        };
    }, [runCheck]);

    // ── Resend countdown ──────────────────────────────────────────────────────
    useEffect(() => {
        if (resendCountdown <= 0) { return; }
        const t = setTimeout(() => setResendCountdown((c) => c - 1), 1_000);
        return () => clearTimeout(t);
    }, [resendCountdown]);

    const handleResend = async () => {
        if (resendCountdown > 0 || isSendingResend) { return; }
        setIsSendingResend(true);
        setResendSuccess(false);
        setVerificationError(null);
        try {
            await apiClient.post('/auth/registration/resend-email/', { email });
            setResendSuccess(true);
            setResendCountdown(RESEND_COOLDOWN_S);
        } catch (error: any) {
            setVerificationError(error?.response?.data?.detail || 'Failed to resend email');
        } finally {
            setIsSendingResend(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Back button */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Illustration */}
                <View style={[styles.iconCircle, { backgroundColor: `${colors.primary}18` }]}>
                    <AppIcon library="Feather" name="mail" size={52} color={colors.primary} />
                </View>

                {/* Heading */}
                <Text style={[styles.title, { color: colors.text }]}>Check Your Inbox</Text>

                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    We sent a verification link to
                </Text>
                <Text style={[styles.emailDisplay, { color: colors.text }]}>
                    {maskEmail(email)}
                </Text>

                {/* Business name confirmation */}
                <View style={[styles.businessInfo, { borderColor: colors.border }]}>
                    <AppIcon library="Feather" name="check-circle" size={18} color={colors.primary} />
                    <Text style={[styles.businessText, { color: colors.textSecondary }]}>
                        Business "{businessName}" created successfully
                    </Text>
                </View>

                <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                    Open the email and tap the link to verify your account.
                    Once verified, you can log in and access your business dashboard.
                </Text>

                {/* Error message */}
                {verificationError && (
                    <View style={[styles.warningBadge, { backgroundColor: `${colors.error ?? '#ef4444'}18` }]}>
                        <AppIcon library="Feather" name="alert-circle" size={14} color={colors.error ?? '#ef4444'} />
                        <Text style={[styles.warningText, { color: colors.error ?? '#ef4444' }]}>
                            {verificationError}
                        </Text>
                    </View>
                )}

                {/* "Not verified yet" feedback */}
                {notVerifiedMsg && !verificationError && (
                    <View style={[styles.warningBadge, { backgroundColor: `${colors.error ?? '#ef4444'}18` }]}>
                        <AppIcon library="Feather" name="clock" size={14} color={colors.error ?? '#ef4444'} />
                        <Text style={[styles.warningText, { color: colors.error ?? '#ef4444' }]}>
                            Email not verified yet. Please check your inbox.
                        </Text>
                    </View>
                )}

                {resendSuccess && (
                    <View style={[styles.warningBadge, { backgroundColor: '#22c55e18' }]}>
                        <AppIcon library="Feather" name="check-circle" size={14} color="#22c55e" />
                        <Text style={[styles.warningText, { color: '#22c55e' }]}>
                            Verification email resent. Check your inbox!
                        </Text>
                    </View>
                )}

                {/* CTA */}
                <View style={styles.actions}>
                    <AppButton
                        title={isChecking ? 'Checking…' : 'Verify & Continue'}
                        onPress={() => runCheck(false)}
                        loading={isChecking}
                        disabled={isChecking}
                        rightIcon="arrow-right"
                    />

                    {/* Resend link */}
                    <TouchableOpacity
                        onPress={handleResend}
                        disabled={resendCountdown > 0 || isSendingResend}
                        style={styles.resendRow}
                    >
                        <Text style={[styles.resendText, { color: resendCountdown > 0 ? colors.textSecondary : colors.primary }]}>
                            {isSendingResend
                                ? 'Sending…'
                                : resendCountdown > 0
                                ? `Resend email in ${resendCountdown}s`
                                : 'Resend verification email'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingTop: 8, height: 56, justifyContent: 'center' },
    backBtn: { padding: 4, alignSelf: 'flex-start' },
    content: { flex: 1, alignItems: 'center', paddingHorizontal: 32, paddingTop: 32 },
    iconCircle: {
        width: 104,
        height: 104,
        borderRadius: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
    subtitle: { fontSize: 15, textAlign: 'center' },
    emailDisplay: { fontSize: 16, fontWeight: '700', textAlign: 'center', marginTop: 4, marginBottom: 16 },
    businessInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 24,
    },
    businessText: { fontSize: 13, flex: 1 },
    instruction: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    warningBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 16,
    },
    warningText: { fontSize: 13, flexShrink: 1 },
    actions: { width: '100%', gap: 16 },
    resendRow: { alignItems: 'center', paddingVertical: 4 },
    resendText: { fontSize: 14 },
});

export default BusinessEmailVerificationScreen;
