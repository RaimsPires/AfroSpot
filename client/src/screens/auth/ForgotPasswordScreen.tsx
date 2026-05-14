import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import type { AuthStackParamList } from '@/navigation/AuthStackNavigator';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const ForgotPasswordScreen = () => {
    const { colors, isDark } = useTheme();
    const navigation = useNavigation<AuthNavigationProp>();
    const [email, setEmail] = useState('');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <AppIcon library="Feather" name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.content}
            >
                <View>
                    <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
                        <AppIcon library="Feather" name="lock" size={32} color={colors.primary} />
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>Forgot Password?</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}> 
                        No worries! Enter your email address below and we will send you a code to reset your password.
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>EMAIL ADDRESS</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                            <AppIcon library="Feather" name="mail" size={20} color={colors.textSecondary} />
                            <TextInput
                                placeholder="name@example.com"
                                placeholderTextColor={colors.textSecondary}
                                style={[styles.input, { color: colors.text }]}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <AppButton
                        title="Send Reset Code"
                        onPress={() => navigation.navigate('OTP')}
                        style={styles.submitBtn}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    backBtn: { padding: 20 },
    content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
    iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 32, alignSelf: 'center' },
    title: { fontSize: 28, fontWeight: '900', marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 15, lineHeight: 24, marginBottom: 40, textAlign: 'center' },
    inputGroup: { marginBottom: 32 },
    label: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 10 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16 },
    input: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '500' },
    submitBtn: { height: 56, borderRadius: 16, marginTop: 10 },
});