import { AppIcon, Input } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LogInScreen = () => {
    const { colors } = useTheme();
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="dark-content" />

            {/* 1. Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.headerTitleRow}>
                    <View style={[styles.logoSmall, { backgroundColor: colors.text }]}>
                        <AppIcon library="MaterialIcons" name="lightning-bolt" size={18} color={colors.background} />
                    </View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Log In</Text>
                </View>

                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="search" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="bell" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* 2. Welcome Text */}
                <View style={styles.welcomeSection}>
                    <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Discover and support African businesses. Log in to your account to continue your journey.
                    </Text>
                </View>

                {/* 3. Segmented Control (Email/Phone) */}
                <View style={[styles.segmentContainer, { backgroundColor: colors.surface }]}>
                    <TouchableOpacity
                        style={[styles.segmentTab, loginMethod === 'email' && styles.activeTab]}
                        onPress={() => setLoginMethod('email')}
                    >
                        <Text style={[styles.tabText, { color: loginMethod === 'email' ? colors.primary : colors.textSecondary }]}>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.segmentTab, loginMethod === 'phone' && styles.activeTab]}
                        onPress={() => setLoginMethod('phone')}
                    >
                        <Text style={[styles.tabText, { color: loginMethod === 'phone' ? colors.primary : colors.textSecondary }]}>Phone</Text>
                    </TouchableOpacity>
                </View>

                {/* 4. Form Inputs */}
                <View style={styles.form}>
                    <Input
                        label="EMAIL ADDRESS"
                        placeholder="name@example.com"
                        leftIcon={{ library: 'Feather', name: 'mail' }}
                    />

                    <View style={styles.passwordHeader}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>PASSWORD</Text>
                        <TouchableOpacity>
                            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Forgot?</Text>
                        </TouchableOpacity>
                    </View>
                    <Input
                        placeholder="••••••••"
                        secureTextEntry
                        leftIcon={{ library: 'Feather', name: 'lock' }}
                    />

                    <AppButton
                        title="Log In"
                        rightIcon='arrow-right'
                        // rightIcon={<AppIcon library="Feather" name="arrow-right" size={20} color="#FFF" />}
                        style={styles.loginBtn}
                    />
                </View>

                {/* 5. Divider */}
                <View style={styles.dividerRow}>
                    <View style={[styles.line, { backgroundColor: colors.border }]} />
                    <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR CONTINUE WITH</Text>
                    <View style={[styles.line, { backgroundColor: colors.border }]} />
                </View>

                {/* 6. Social Logins */}
                <View style={styles.socialRow}>
                    <SocialButton library="AntDesign" name="google" color="#DB4437" />
                    <SocialButton library="AntDesign" name="apple1" color="#000" />
                    <SocialButton library="AntDesign" name="facebook-square" color="#4267B2" />
                </View>

                {/* 7. Footer Links */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                        Don't have an account? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Create Account</Text>
                    </Text>

                    <View style={styles.secureRow}>
                        <AppIcon library="Feather" name="globe" size={14} color={colors.textSecondary} />
                        <Text style={[styles.secureText, { color: colors.textSecondary }]}>SECURE CONNECTION VERIFIED</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const SocialButton = ({ library, name, color }: any) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={[styles.socialBtn, { borderColor: colors.border }]}>
            <AppIcon library={library} name={name} size={22} color={color} />
        </TouchableOpacity>
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
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logoSmall: { padding: 4, borderRadius: 6 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerRight: { flexDirection: 'row', gap: 12 },
    iconBtn: { padding: 4 },

    scrollContent: { padding: 24 },
    welcomeSection: { marginBottom: 32 },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
    subtitle: { fontSize: 15, lineHeight: 22 },

    segmentContainer: { flexDirection: 'row', padding: 4, borderRadius: 14, marginBottom: 32 },
    segmentTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    tabText: { fontWeight: '700', fontSize: 15 },

    form: { gap: 16 },
    passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -8 },
    inputLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
    loginBtn: { marginTop: 12 },

    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 32, gap: 12 },
    line: { flex: 1, height: 1 },
    dividerText: { fontSize: 12, fontWeight: '700' },

    socialRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
    socialBtn: { flex: 1, height: 56, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

    footer: { marginTop: 40, alignItems: 'center', gap: 24 },
    footerText: { fontSize: 15 },
    secureRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    secureText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
});

export default LogInScreen;