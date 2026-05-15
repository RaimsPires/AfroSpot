import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTheme } from '@contexts/ThemeContext';

// --- Mock Data / Config ---
const REPORT_REASONS = [
    { id: 'spam', label: 'Spam or misleading' },
    { id: 'inappropriate', label: 'Inappropriate or offensive content' },
    { id: 'harassment', label: 'Harassment or bullying' },
    { id: 'scam', label: 'Scam or fraud' },
    { id: 'ip_violation', label: 'Intellectual property violation' },
    { id: 'other', label: 'Other' },
];

const ReportScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    // Form State
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [details, setDetails] = useState('');

    // UI Flow State
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!selectedReason) return;

        // Here you would typically send the report payload to your backend
        // e.g., api.post('/report', { targetId: '123', type: 'post', reason: selectedReason, details })

        setIsSubmitted(true);
    };

    // --- Success State ---
    if (isSubmitted) {
        return (
            <SafeAreaView style={[styles.statusContainer, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                <View style={styles.successCircle}>
                    <AppIcon library="Feather" name="check" size={40} color="#FFF" />
                </View>
                <Text style={[styles.statusTitle, { color: colors.text }]}>Report Submitted</Text>
                <Text style={[styles.statusSub, { color: colors.textSecondary }]}>
                    Thank you for keeping the AfroSpot community safe. Our moderation team will review this report shortly.
                </Text>
                <View style={{ width: '100%', marginTop: 24 }}>
                    <AppButton
                        title="Done"
                        onPress={() => {
                            // Reset or Navigate Back
                            // navigation.goBack();
                            setIsSubmitted(false);
                            setSelectedReason(null);
                            setDetails('');
                        }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    // --- Form State ---
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => {/* navigation.goBack() */ }}>
                    <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Report</Text>
                <View style={{ width: 40 }} /> {/* Spacer */}
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Context Info */}
                    <View style={[styles.contextBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="alert-triangle" size={20} color="#F59E0B" style={{ marginRight: 12 }} />
                        <Text style={[styles.contextText, { color: colors.textSecondary }]}>
                            You are reporting <Text style={{ fontWeight: '700', color: colors.text }}>@kofi_styles</Text>'s post.
                            This report will be sent anonymously to our moderation team.
                        </Text>
                    </View>

                    {/* 2. Reason Selection */}
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Why are you reporting this?</Text>
                    <View style={[styles.reasonsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        {REPORT_REASONS.map((reason, index) => {
                            const isActive = selectedReason === reason.id;
                            const isLast = index === REPORT_REASONS.length - 1;

                            return (
                                <TouchableOpacity
                                    key={reason.id}
                                    onPress={() => setSelectedReason(reason.id)}
                                    style={[
                                        styles.reasonRow,
                                        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }
                                    ]}
                                >
                                    <Text style={[styles.reasonLabel, { color: colors.text }]}>{reason.label}</Text>
                                    <View style={[
                                        styles.radioCircle,
                                        { borderColor: isActive ? colors.primary : colors.border }
                                    ]}>
                                        {isActive && <View style={[styles.radioFill, { backgroundColor: colors.primary }]} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* 3. Additional Details */}
                    <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Additional Details (Optional)</Text>
                    <TextInput
                        style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        value={details}
                        onChangeText={setDetails}
                        placeholder="Please provide any additional context to help us understand the issue..."
                        placeholderTextColor={colors.textSecondary}
                        multiline
                        textAlignVertical="top"
                    />

                </ScrollView>
            </KeyboardAvoidingView>

            {/* 4. Sticky Footer */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <AppButton
                    title="Submit Report"
                    disabled={!selectedReason}
                    onPress={handleSubmit}
                />
            </View>
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },

    // Context Box
    contextBox: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
    contextText: { flex: 1, fontSize: 13, lineHeight: 20 },

    sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12 },

    // Reasons Card
    reasonsCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    reasonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16 },
    reasonLabel: { fontSize: 15, fontWeight: '500', flex: 1 },
    radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    radioFill: { width: 12, height: 12, borderRadius: 6 },

    // Text Area
    textArea: { height: 120, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, fontSize: 15 },

    // Footer
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1 },

    // Success State
    statusContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginBottom: 24, elevation: 5, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
    statusTitle: { fontSize: 24, fontWeight: '900', marginBottom: 12 },
    statusSub: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
});

export default ReportScreen;