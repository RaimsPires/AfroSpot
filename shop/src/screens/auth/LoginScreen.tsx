import { logo } from '@assets/index';
import { AppAlert, Input } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList, RootStackParamList } from '@navigation/types';
import { CompositeNavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoginScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList, 'Auth'>,
    NativeStackNavigationProp<RootStackParamList>
>;

const LoginScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { signIn, loading } = useAuth();
    const route = useRoute();
    const [email, setEmail] = useState('admin2@admin.com');
    const [password, setPassword] = useState('Afrospot123!');
    const [loginError, setLoginError] = useState<string | null>(null);
    const mode = (route.params as AuthStackParamList['Auth'])?.mode;
    const isBusinessRegistrationMode = mode === 'businessRegistration';
    const headerTitle = isBusinessRegistrationMode ? 'Business Account Login' : 'Welcome Back';
    const headerSubtitle = isBusinessRegistrationMode
        ? 'Sign in with your AfroSpot account to continue business registration.'
        : 'Log in to manage your business and bookings.';
    const ctaTitle = isBusinessRegistrationMode ? 'Continue to Business KYC' : 'Sign In';


    const handleLogin = () => {
        signIn({
            login_id: email.trim(),
            password: password.trim(),
        }).catch((error) => {
            setLoginError(error.message || 'An error occurred while trying to log in.');
        });
    };

    // const handleLogin = () => {
    //     if (isBusinessRegistrationMode) {
    //         navigation.replace('BusinessKYC');
    //         return;
    //     }

    //     const parent = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    //     parent?.replace('AppFlow');
    // };


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flexOne}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView
                        contentContainerStyle={styles.content}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps="handled"
                    >
                        <View>
                            <Image source={logo} style={styles.logo} />
                        </View>
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: colors.text }]}>{headerTitle}</Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{headerSubtitle}</Text>
                        </View>

                        {isBusinessRegistrationMode && (
                            <View
                                style={[
                                    styles.modeBanner,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: colors.primary,
                                    },
                                ]}
                            >
                                <View style={[styles.modeBannerIcon, { backgroundColor: colors.primary }]}>
                                    <Text style={[styles.modeBannerIconText, { color: colors.textInverse }]}>2</Text>
                                </View>
                                <View style={styles.modeBannerContent}>
                                    <Text style={[styles.modeBannerTitle, { color: colors.text }]}>Business Registration</Text>
                                    <Text style={[styles.modeBannerSubtitle, { color: colors.textSecondary }]}>Step 2 of 3: Log in with your existing account.</Text>
                                </View>
                            </View>
                        )}

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
                        <View style={styles.form}>
                            <Input
                                label="EMAIL ADDRESS"
                                placeholder="name@example.com"
                                leftIcon={{ library: 'Feather', name: 'mail' }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Input
                                placeholder="••••••••"
                                secureTextEntry
                                leftIcon={{ library: 'Feather', name: 'lock' }}
                                value={password}
                                onChangeText={setPassword}
                            />

                            {!isBusinessRegistrationMode && (
                                <TouchableOpacity style={styles.forgotLink} onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
                                </TouchableOpacity>
                            )}


                            <AppButton
                                loading={loading}
                                title={ctaTitle}
                                onPress={handleLogin}
                                rightIcon='arrow-right'
                                disabled={!(email.trim() || !password.trim() || loading)}
                                // rightIcon={<AppIcon library="Feather" name="arrow-right" size={20} color="#FFF" />}
                                style={styles.loginBtn}
                            />

                            {!isBusinessRegistrationMode && (
                                <TouchableOpacity style={styles.switchMode} onPress={() => navigation.navigate('AccountChoice')}>
                                    <Text style={[styles.switchModeText, { color: colors.textSecondary }]}>
                                        Want to open a business account? <Text style={[styles.switchModeLink, { color: colors.primary }]}>Register Business</Text>
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


export default LoginScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    flexOne: { flex: 1 },
    logo: { width: 120, height: 120, resizeMode: 'contain', alignSelf: 'center', marginBottom: 32 },
    content: { padding: 24, flexGrow: 1, justifyContent: 'center' },
    header: { marginBottom: 32 },
    title: { fontSize: 32, fontWeight: '900', marginBottom: 8 },
    subtitle: { fontSize: 15, lineHeight: 22 },
    modeBanner: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    modeBannerIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modeBannerIconText: {
        fontSize: 13,
        fontWeight: '800',
    },
    modeBannerContent: { flex: 1 },
    modeBannerTitle: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
    modeBannerSubtitle: { fontSize: 12, lineHeight: 17 },
    loginErrorAlert: { marginBottom: 20 },
    form: { gap: 16 },
    input: { height: 56, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 16 },
    forgotLink: { alignSelf: 'flex-end' },
    forgotText: { fontSize: 13, fontWeight: '700' },
    mainBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
    mainBtnText: { fontSize: 16, fontWeight: '800' },
    loginBtn: { marginTop: 12 },
    switchMode: { alignItems: 'center', marginTop: 12 },
    switchModeText: {},
    switchModeLink: { fontWeight: '700' },
});