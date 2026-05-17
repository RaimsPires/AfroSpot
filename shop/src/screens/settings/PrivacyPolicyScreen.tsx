import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

export const PrivacyPolicyScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}> 
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
                <View style={styles.iconBtn} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Data We Collect</Text>
                    <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>We collect profile details, service and product data, customer interactions, and payment-related records necessary to run your business tools.</Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>How We Use Data</Text>
                    <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>Data is used to operate scheduling, payments, analytics, support, and fraud prevention features across AfroSpot services.</Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Security Measures</Text>
                    <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>We use encryption and access controls to help protect your account and customer information.</Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Controls</Text>
                    <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>You can request updates to your business data and manage account settings directly in the app.</Text>
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
