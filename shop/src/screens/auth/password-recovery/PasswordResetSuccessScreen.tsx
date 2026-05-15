import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<AuthStackParamList, 'PasswordResetSuccess'>;

export const PasswordResetSuccessScreen = ({ navigation }: Props) => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            <View style={styles.successContainer}>
                <View style={styles.successCircle}>
                    <AppIcon library="Feather" name="check" size={48} color="#FFF" />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>Password Reset</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}> 
                    Your password has been reset successfully. You can now log in with your new password.
                </Text>

                <TouchableOpacity
                    style={[styles.mainBtn, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate('Auth')}
                >
                    <Text style={styles.mainBtnText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    successCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginBottom: 32, elevation: 5, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
    title: { fontSize: 32, fontWeight: '900', marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 15, lineHeight: 24, textAlign: 'center', marginBottom: 32 },
    mainBtn: { width: '100%', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    mainBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

export default PasswordResetSuccessScreen;
