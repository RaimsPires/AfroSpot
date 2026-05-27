import { logo } from '@assets/index';
import { AppAlert, AppIcon, Input } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/AuthStackNavigator';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const LogInScreen = () => {
    const { colors } = useTheme();
    const { signIn, loading } = useAuth();
    const navigation = useNavigation<AuthNavigationProp>();
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [email, setEmail] = useState('admin@admin.com');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('1234');

    const handleLogin = () => {
        const credential = loginMethod === 'email' ? email.trim() : phone.trim();

        if (!credential || !password.trim()) {
            Alert.alert('Missing details', `Please enter your ${loginMethod} and password.`);
            return;
        }

        signIn({
            login_id: credential,
            password: password.trim(),
        }).catch((error) => {
            setLoginError(error.message || 'An error occurred while trying to log in.');
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View>
                    <Image source={logo} style={styles.logo} />
                </View>
                {/* 2. Welcome Text */}
                <View style={styles.welcomeSection}>
                    <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Discover and support African businesses. Log in to your account to continue your journey.
                    </Text>
                </View>

                {loginError && (
                    <AppAlert
                    visible={!!loginError}
                        title="Login failed"
                        message={loginError}
                        variant="error"
                        dismissible
                        onClose={() => setLoginError(null)}
                        containerStyle={styles.loginErrorAlert}
                    />
                )}

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
                    {loginMethod === 'email' ? (
                        <Input
                            label="EMAIL ADDRESS"
                            placeholder="name@example.com"
                            leftIcon={{ library: 'Feather', name: 'mail' }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    ) : (
                        <Input
                            label="PHONE NUMBER"
                            placeholder="e.g. +234 812 345 6789"
                            leftIcon={{ library: 'Feather', name: 'phone' }}
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    )}

                    <View style={styles.passwordHeader}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>PASSWORD</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot?</Text>
                        </TouchableOpacity>
                    </View>
                    <Input
                        placeholder="••••••••"
                        secureTextEntry
                        leftIcon={{ library: 'Feather', name: 'lock' }}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <AppButton
                        loading={loading}
                        title="Log In"
                        onPress={handleLogin}
                        rightIcon='arrow-right'
                        disabled={!(loginMethod === 'email' ? email.trim() : phone.trim()) || !password.trim() || loading}
                        // rightIcon={<AppIcon library="Feather" name="arrow-right" size={20} color="#FFF" />}
                        style={styles.loginBtn}
                    />
                </View>

                {/* 7. Footer Links */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                        Don't have an account?{' '}
                        <Text style={[styles.footerLinkText, { color: colors.primary }]} onPress={() => navigation.navigate('Register')}>
                            Create Account
                        </Text>
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


const styles = StyleSheet.create({
    container: { flex: 1 },

    logo: { width: 60, height: 60, padding: 8, borderRadius: 10, margin: 10, borderWidth: 1, borderColor: '#000', resizeMode: 'contain' },

    scrollContent: { padding: 24 },
    welcomeSection: { marginBottom: 32 },
    loginErrorAlert: { marginBottom: 20 },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
    subtitle: { fontSize: 15, lineHeight: 22 },

    segmentContainer: { flexDirection: 'row', padding: 4, borderRadius: 14, marginBottom: 32 },
    segmentTab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    tabText: { fontWeight: '700', fontSize: 15 },

    form: { gap: 16 },
    passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -8 },
    inputLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
    forgotText: { fontWeight: '700', fontSize: 13 },
    loginBtn: { marginTop: 12 },

    footer: { marginTop: 40, alignItems: 'center', gap: 24 },
    footerText: { fontSize: 15 },
    footerLinkText: { fontWeight: '700' },
    secureRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    secureText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
});

export default LogInScreen;