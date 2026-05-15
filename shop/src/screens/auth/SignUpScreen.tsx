import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SignUpNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export const SignUpScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<SignUpNavigationProp>();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isDisabled =
        !fullName.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !password.trim() ||
        password !== confirmPassword;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flexOne}>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                            <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}> 
                            Create your business account and start selling on AfroSpot.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            placeholder="Full Name"
                            placeholderTextColor={colors.textSecondary}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            placeholder="Email Address"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            placeholder="Phone Number"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            placeholder="Password"
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TextInput
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                            placeholder="Confirm Password"
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        <TouchableOpacity
                            style={[styles.mainBtn, { backgroundColor: isDisabled ? colors.surface : colors.primary }]}
                            disabled={isDisabled}
                            onPress={() => navigation.navigate('UserOnboarding')}
                        >
                            <Text style={[styles.mainBtnText, { color: isDisabled ? colors.textSecondary : '#FFF' }]}>Create Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.switchMode} onPress={() => navigation.navigate('Auth')}>
                            <Text style={{ color: colors.textSecondary }}>
                                Already have an account? <Text style={{ color: colors.primary, fontWeight: '700' }}>Sign In</Text>
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
    headerRow: { marginBottom: 8 },
    iconBtn: { padding: 8, alignSelf: 'flex-start' },
    header: { marginBottom: 24 },
    title: { fontSize: 32, fontWeight: '900', marginBottom: 8 },
    subtitle: { fontSize: 15, lineHeight: 22 },
    form: { gap: 16 },
    input: { height: 56, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 16 },
    mainBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
    mainBtnText: { fontSize: 16, fontWeight: '800' },
    switchMode: { alignItems: 'center', marginTop: 12 },
});

export default SignUpScreen;
