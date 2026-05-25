import { AppIcon } from '@components/ui';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen = ({ navigation }: Props) => {
    const { colors, isDark } = useTheme();
    const { forgotPassword, loading } = useAuth();
    const [contactInfo, setContactInfo] = useState('');

    const handleSubmit = () => {
        const email = contactInfo.trim().toLowerCase();
        if (!email) {
            Alert.alert('Missing email', 'Please enter your account email address.');
            return;
        }

        forgotPassword({ email })
            .then(() => {
                Alert.alert(
                    'Reset email sent',
                    'If your account exists, we sent a password reset link to your email.',
                    [{ text: 'OK', onPress: () => navigation.navigate('Auth') }],
                );
            })
            .catch((error) => {
                Alert.alert(
                    'Unable to send reset email',
                    error?.response?.data?.detail || 'Please try again later.',
                );
            });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps="handled"
                    >
                    <View style={styles.formContainer}>
                        <Text style={[styles.title, { color: colors.text }]}>Forgot Password?</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Do not worry. Enter your email address or phone number and we will send a reset code.
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>EMAIL OR PHONE</Text>
                            <TextInput
                                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                                placeholder="e.g. name@example.com or +1234567890"
                                placeholderTextColor={colors.textSecondary}
                                value={contactInfo}
                                onChangeText={setContactInfo}
                                autoCapitalize="none"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.mainBtn, { backgroundColor: contactInfo ? colors.primary : colors.surface }]}
                            disabled={!contactInfo || loading}
                            onPress={handleSubmit}
                        >
                            <Text style={[styles.mainBtnText, { color: contactInfo ? colors.textInverse : colors.textSecondary }]}>
                                {loading ? 'Sending...' : 'Send Reset Email'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingVertical: 12 },
    iconBtn: { padding: 8, alignSelf: 'flex-start' },
    scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 60, flexGrow: 1, justifyContent: 'center' },
    formContainer: { width: '100%' },
    title: { fontSize: 32, fontWeight: '900', marginBottom: 12 },
    subtitle: { fontSize: 15, lineHeight: 24, marginBottom: 32 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
    input: { height: 56, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 16 },
    mainBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    mainBtnText: { fontSize: 16, fontWeight: '800' },
});

export default ForgotPasswordScreen;
