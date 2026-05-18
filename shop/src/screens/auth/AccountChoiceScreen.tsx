import { AppIcon, Button } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import type { AuthStackParamList } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

type AccountChoiceNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'AccountChoice'>;

export const AccountChoiceScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<AccountChoiceNavigationProp>();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <View style={styles.content}>
                <View style={styles.headerSection}>
                    <Text style={[styles.stepText, { color: colors.primary }]}>Step 1 of 3</Text>
                    <Text style={[styles.title, { color: colors.text }]}>Set up your shop account</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Use an existing AfroSpot account or create a new one to start business registration.</Text>
                </View>

                <View style={styles.choiceCards}>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                        <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}> 
                            <AppIcon library="Feather" name="user-check" size={22} color={colors.textInverse} />
                        </View>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>Use existing AfroSpot account</Text>
                        <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>Sign in and continue directly to business registration.</Text>
                        <Button title="Sign In" onPress={() => navigation.navigate('Auth', { mode: 'businessRegistration' })} />
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                        <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}> 
                            <AppIcon library="Feather" name="user-plus" size={22} color={colors.textInverse} />
                        </View>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>Create a new AfroSpot account</Text>
                        <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>Create your account, then continue to business registration.</Text>
                        <Button title="Create Account" variant="outline" onPress={() => navigation.navigate('SignUp')} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, padding: 24, justifyContent: 'center' },
    headerSection: { marginBottom: 24 },
    stepText: { fontSize: 13, fontWeight: '800', marginBottom: 8 },
    title: { fontSize: 30, fontWeight: '900', marginBottom: 8 },
    subtitle: { fontSize: 15, lineHeight: 22 },
    choiceCards: { gap: 16 },
    card: { borderWidth: 1, borderRadius: 18, padding: 18 },
    iconWrap: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    cardTitle: { fontSize: 17, fontWeight: '800', marginBottom: 6 },
    cardDescription: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
});

export default AccountChoiceScreen;
