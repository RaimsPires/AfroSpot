import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const MerchantSupportScreen = () => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}><AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Merchant Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Text style={[styles.greeting, { color: colors.text }]}>How can we help you today?</Text>

                <View style={styles.contactGrid}>
                    <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="message-square" size={28} color={colors.primary} style={{ marginBottom: 12 }} />
                        <Text style={[styles.contactTitle, { color: colors.text }]}>Live Chat</Text>
                        <Text style={[styles.contactSub, { color: colors.textSecondary }]}>Wait time: ~2 mins</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="mail" size={28} color={colors.primary} style={{ marginBottom: 12 }} />
                        <Text style={[styles.contactTitle, { color: colors.text }]}>Email Us</Text>
                        <Text style={[styles.contactSub, { color: colors.textSecondary }]}>Replies within 24h</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Common Questions</Text>
                <View style={[styles.faqContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <FAQItem title="When do I receive my payouts?" colors={colors} />
                    <FAQItem title="How do I pause a promotion?" colors={colors} />
                    <FAQItem title="What are the platform fees?" colors={colors} />
                    <FAQItem title="Can I block a customer?" colors={colors} isLast />
                </View>

                <TouchableOpacity style={[styles.knowledgeBtn, { backgroundColor: colors.primary + '10' }]}>
                    <Text style={[styles.knowledgeText, { color: colors.primary }]}>Visit Knowledge Base</Text>
                    <AppIcon library="Feather" name="external-link" size={16} color={colors.primary} />
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const FAQItem = ({ title, isLast, colors }: any) => (
    <TouchableOpacity style={[styles.faqItem, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
        <Text style={[styles.faqTitle, { color: colors.text }]}>{title}</Text>
        <AppIcon library="Feather" name="chevron-down" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 4 },
    content: { padding: 20 },
    greeting: { fontSize: 24, fontWeight: '900', marginBottom: 24 },
    contactGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
    contactCard: { flex: 1, padding: 20, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
    contactTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    contactSub: { fontSize: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
    faqContainer: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 24 },
    faqItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    faqTitle: { fontSize: 14, fontWeight: '600', flex: 1 },
    knowledgeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8 },
    knowledgeText: { fontSize: 15, fontWeight: '700' },
});