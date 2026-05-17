import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const FAQS = [
    'How do I verify my business profile?',
    'How can I manage staff permissions?',
    'When do payouts arrive?',
    'How can I boost a store feed?',
];

export const HelpCenterScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}> 
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Help Center & FAQ</Text>
                <View style={styles.iconBtn} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.cardTitle, { color: colors.text }]}>How can we help?</Text>
                    <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>Find quick answers to common business account questions.</Text>
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    {FAQS.map((item, index) => (
                        <View
                            key={item}
                            style={[
                                styles.faqRow,
                                index !== FAQS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                            ]}
                        >
                            <Text style={[styles.faqText, { color: colors.text }]}>{item}</Text>
                            <AppIcon library="Feather" name="chevron-right" size={16} color={colors.textSecondary} />
                        </View>
                    ))}
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
    content: { padding: 20, gap: 14 },
    card: { borderWidth: 1, borderRadius: 14, padding: 14 },
    cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
    cardDesc: { fontSize: 13, fontWeight: '500', lineHeight: 20 },
    faqRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
    faqText: { fontSize: 14, fontWeight: '600', flex: 1, marginRight: 10 },
});
