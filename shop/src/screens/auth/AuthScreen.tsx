import { Button } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList, RootStackParamList } from '@navigation/types';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList, 'Auth'>,
    NativeStackNavigationProp<RootStackParamList>
>;

export const AuthScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<AuthScreenNavigationProp>();
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleLogin = () => {
        const parent = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
        parent?.replace('AppFlow');
    };


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flexOne}>
                <ScrollView contentContainerStyle={styles.content}>

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Log in to manage your business and bookings.
                        </Text>
                    </View>
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

                        <TouchableOpacity style={styles.forgotLink} onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
                        </TouchableOpacity>

                        <Button
                            onPress={handleLogin}
                            title='Sign In'
                        />


                        <TouchableOpacity style={styles.switchMode} onPress={() => navigation.navigate('SignUp')}>
                            <Text style={[styles.switchModeText, { color: colors.textSecondary }]}>
                                Do not have an account? <Text style={[styles.switchModeLink, { color: colors.primary }]}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    flexOne: { flex: 1 },
    content: { padding: 24, flexGrow: 1, justifyContent: 'center' },
    header: { marginBottom: 32 },
    title: { fontSize: 32, fontWeight: '900', marginBottom: 8 },
    subtitle: { fontSize: 15, lineHeight: 22 },
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