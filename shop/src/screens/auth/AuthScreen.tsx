import { logo } from '@assets/index';
import { Button } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList, RootStackParamList } from '@navigation/types';
import { CompositeNavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList, 'Auth'>,
    NativeStackNavigationProp<RootStackParamList>
>;

export const AuthScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<AuthScreenNavigationProp>();
    const route = useRoute();
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const mode = (route.params as AuthStackParamList['Auth'])?.mode;
    const isBusinessRegistrationMode = mode === 'businessRegistration';
    const headerTitle = isBusinessRegistrationMode ? 'Business Account Login' : 'Welcome Back';
    const headerSubtitle = isBusinessRegistrationMode
        ? 'Sign in with your AfroSpot account to continue business registration.'
        : 'Log in to manage your business and bookings.';
    const ctaTitle = isBusinessRegistrationMode ? 'Continue to Business KYC' : 'Sign In';

    const handleLogin = () => {
        if (isBusinessRegistrationMode) {
            navigation.replace('BusinessKYC');
            return;
        }

        const parent = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
        parent?.replace('AppFlow');
    };


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

                    <View style={styles.form}>
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            placeholder="Email Address"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={loginEmail}
                            onChangeText={setLoginEmail}
                        />
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            placeholder="Password"
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry
                            value={loginPassword}
                            onChangeText={setLoginPassword}
                        />

                        {!isBusinessRegistrationMode && (
                            <TouchableOpacity style={styles.forgotLink} onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
                            </TouchableOpacity>
                        )}

                        <Button
                            onPress={handleLogin}
                            title={ctaTitle}
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
    form: { gap: 16 },
    input: { height: 56, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 16 },
    forgotLink: { alignSelf: 'flex-end' },
    forgotText: { fontSize: 13, fontWeight: '700' },
    mainBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
    mainBtnText: { fontSize: 16, fontWeight: '800' },
    switchMode: { alignItems: 'center', marginTop: 12 },
    switchModeText: {},
    switchModeLink: { fontWeight: '700' },
});