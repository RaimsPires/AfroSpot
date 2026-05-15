import { AppIcon, Input } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const BusinessKYCScreen = () => {
    const { colors } = useTheme();
    const [step, setStep] = useState(1);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                <Text style={[styles.title, { color: colors.text }]}>Merchant Verification</Text>
                <View style={styles.progressRow}>
                    <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
                    <View style={[styles.progressLine, { backgroundColor: step >= 2 ? colors.primary : colors.border }]} />
                    <View style={[styles.progressDot, { backgroundColor: step >= 2 ? colors.primary : colors.border }]} />
                    <View style={[styles.progressLine, { backgroundColor: step >= 3 ? colors.primary : colors.border }]} />
                    <View style={[styles.progressDot, { backgroundColor: step >= 3 ? colors.primary : colors.border }]} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && (
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Business Details</Text>
                        <Input inputWrapperStyle={[styles.input, { borderColor: colors.border }]} inputStyle={{ color: colors.text }} placeholder="Legal Business Name" placeholderTextColor={colors.textSecondary} />
                        <Input inputWrapperStyle={[styles.input, { borderColor: colors.border }]} inputStyle={{ color: colors.text }} placeholder="Tax ID / EIN" placeholderTextColor={colors.textSecondary} />
                        <Input inputWrapperStyle={[styles.input, { borderColor: colors.border }]} inputStyle={{ color: colors.text }} placeholder="Business Address" placeholderTextColor={colors.textSecondary} />
                    </View>
                )}

                {step === 2 && (
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Document Upload</Text>
                        <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>Please upload a valid government ID and business license.</Text>

                        <TouchableOpacity style={[styles.uploadBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="camera" size={24} color={colors.primary} />
                            <Text style={[styles.uploadText, { color: colors.text }]}>Upload Government ID</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.uploadBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="file-text" size={24} color={colors.primary} />
                            <Text style={[styles.uploadText, { color: colors.text }]}>Upload Business License</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 3 && (
                    <View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Payout Details</Text>
                        <Text style={{ color: colors.textSecondary, marginBottom: 16 }}>Where should we send your earnings?</Text>
                        <Input inputWrapperStyle={[styles.input, { borderColor: colors.border }]} inputStyle={{ color: colors.text }} placeholder="Bank Name" placeholderTextColor={colors.textSecondary} />
                        <Input inputWrapperStyle={[styles.input, { borderColor: colors.border }]} inputStyle={{ color: colors.text }} placeholder="Account Holder Name" placeholderTextColor={colors.textSecondary} />
                        <Input inputWrapperStyle={[styles.input, { borderColor: colors.border }]} inputStyle={{ color: colors.text }} placeholder="Routing Number" placeholderTextColor={colors.textSecondary} keyboardType="number-pad" />
                        <Input inputWrapperStyle={[styles.input, { borderColor: colors.border }]} inputStyle={{ color: colors.text }} placeholder="Account Number" placeholderTextColor={colors.textSecondary} keyboardType="number-pad" />
                    </View>
                )}
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.primary }]} onPress={() => step < 3 ? setStep(step + 1) : console.log('Submit KYC')}>
                    <Text style={[styles.mainBtnText, { color: colors.textInverse }]}>{step === 3 ? 'Submit for Verification' : 'Next Step'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { padding: 24, borderBottomWidth: 1 },
    title: { fontSize: 24, fontWeight: '900', marginBottom: 16 },
    progressRow: { flexDirection: 'row', alignItems: 'center' },
    progressDot: { width: 12, height: 12, borderRadius: 6 },
    progressLine: { flex: 1, height: 2, marginHorizontal: 8 },
    content: { padding: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
    input: { height: 56, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, marginBottom: 16 },
    uploadBox: { height: 100, borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    uploadText: { marginTop: 8, fontWeight: '600' },
    footer: { padding: 24, borderTopWidth: 1 },
    mainBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    mainBtnText: { fontSize: 16, fontWeight: '800' },
});