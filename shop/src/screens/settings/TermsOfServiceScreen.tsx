import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

export const TermsOfServiceScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}> 
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Terms of Service</Text>
                <View style={styles.iconBtn} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Platform Usage</Text>
                    <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>You agree to use AfroSpot Business features for lawful business operations and keep account details accurate.</Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Merchant Responsibilities</Text>
                    <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>You are responsible for services offered, appointment handling, product quality, and communication with customers.</Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Payments and Fees</Text>
                    <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>Processing fees and payout schedules apply to transactions and are shown in your finance dashboard.</Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Account Enforcement</Text>
                    <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>Violation of policies may result in account suspension or removal to protect platform safety and trust.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    iconBtn: { width: 32, alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '800' },
    content: { padding: 20 },
    card: { borderWidth: 1, borderRadius: 14, padding: 14 },
    sectionTitle: { fontSize: 14, fontWeight: '800', marginBottom: 6, marginTop: 6 },
    sectionBody: { fontSize: 13, fontWeight: '500', lineHeight: 20, marginBottom: 8 },
});
