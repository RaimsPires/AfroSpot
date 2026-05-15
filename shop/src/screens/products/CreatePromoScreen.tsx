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
import { useTheme } from '@contexts/ThemeContext';

const APPLIES_TO_OPTIONS = ['All Services', 'All Products', 'Specific Items'];

const CreatePromoScreen = () => {
    const { colors, isDark } = useTheme();

    // Form States
    const [title, setTitle] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
    const [discountValue, setDiscountValue] = useState('');
    const [appliesTo, setAppliesTo] = useState('All Services');
    const [startDate, setStartDate] = useState('Oct 24, 2023'); // Mocked date string
    const [endDate, setEndDate] = useState('Oct 31, 2023');     // Mocked date string

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Create Promotion</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* 2. Live Preview Card */}
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Preview</Text>
                    <View style={[styles.previewCard, { backgroundColor: colors.primary }]}>
                        <View style={styles.previewLeft}>
                            <View style={styles.badgeLabel}>
                                <Text style={styles.badgeText}>SPECIAL OFFER</Text>
                            </View>
                            <Text style={styles.previewTitle} numberOfLines={2}>
                                {title || 'Your Promo Title'}
                            </Text>
                            <Text style={styles.previewSub}>
                                Applies to: {appliesTo}
                            </Text>
                        </View>
                        <View style={styles.previewRight}>
                            <Text style={styles.previewDiscount}>
                                {discountValue ? (discountType === 'percentage' ? `${discountValue}%` : `$${discountValue}`) : '0%'}
                            </Text>
                            <Text style={styles.previewOff}>OFF</Text>
                            {promoCode ? (
                                <View style={styles.codeBox}>
                                    <Text style={styles.codeText}>{promoCode.toUpperCase()}</Text>
                                </View>
                            ) : null}
                        </View>
                        {/* Scalloped edge design element common in coupons */}
                        <View style={[styles.scallopTop, { backgroundColor: colors.background }]} />
                        <View style={[styles.scallopBottom, { backgroundColor: colors.background }]} />
                    </View>

                    {/* 3. Basic Info Form */}
                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PROMOTION TITLE</Text>
                            <TextInput
                                style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="e.g. Weekend Flash Sale"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PROMO CODE (OPTIONAL)</Text>
                            <TextInput
                                style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, textTransform: 'uppercase' }]}
                                value={promoCode}
                                onChangeText={setPromoCode}
                                placeholder="e.g. SUMMER20"
                                autoCapitalize="characters"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>
                    </View>

                    {/* 4. Discount Configuration */}
                    <View style={styles.formSection}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DISCOUNT TYPE & VALUE</Text>

                        <View style={[styles.toggleContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <TouchableOpacity
                                style={[styles.toggleBtn, discountType === 'percentage' && [styles.toggleActive, { backgroundColor: colors.primary }]]}
                                onPress={() => setDiscountType('percentage')}
                            >
                                <Text style={[styles.toggleText, { color: discountType === 'percentage' ? '#FFF' : colors.textSecondary }]}>
                                    Percentage (%)
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleBtn, discountType === 'fixed' && [styles.toggleActive, { backgroundColor: colors.primary }]]}
                                onPress={() => setDiscountType('fixed')}
                            >
                                <Text style={[styles.toggleText, { color: discountType === 'fixed' ? '#FFF' : colors.textSecondary }]}>
                                    Fixed Amount ($)
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.iconInputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Text style={[styles.inputIconText, { color: colors.textSecondary }]}>
                                {discountType === 'percentage' ? '%' : '$'}
                            </Text>
                            <TextInput
                                style={[styles.iconInputField, { color: colors.text }]}
                                value={discountValue}
                                onChangeText={setDiscountValue}
                                placeholder="0"
                                keyboardType="numeric"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>
                    </View>

                    {/* 5. Target & Scheduling */}
                    <View style={styles.formSection}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>APPLIES TO</Text>
                        <View style={styles.chipsWrapper}>
                            {APPLIES_TO_OPTIONS.map((option) => {
                                const isActive = appliesTo === option;
                                return (
                                    <TouchableOpacity
                                        key={option}
                                        onPress={() => setAppliesTo(option)}
                                        style={[
                                            styles.chip,
                                            {
                                                backgroundColor: isActive ? colors.primary + '15' : colors.surface,
                                                borderColor: isActive ? colors.primary : colors.border,
                                            }
                                        ]}
                                    >
                                        <Text style={[styles.chipText, { color: isActive ? colors.primary : colors.text }]}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {appliesTo === 'Specific Items' && (
                            <TouchableOpacity style={[styles.selectItemsBtn, { borderColor: colors.primary, backgroundColor: colors.primary + '05' }]}>
                                <AppIcon library="Feather" name="plus-circle" size={16} color={colors.primary} />
                                <Text style={[styles.selectItemsText, { color: colors.primary }]}>Select Products/Services</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.formSection}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DURATION</Text>
                        <View style={styles.rowInputs}>
                            <TouchableOpacity style={[styles.dateInputWrap, { backgroundColor: colors.surface, borderColor: colors.border, marginRight: 12 }]}>
                                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Starts</Text>
                                <View style={styles.dateValueRow}>
                                    <Text style={[styles.dateValue, { color: colors.text }]}>{startDate}</Text>
                                    <AppIcon library="Feather" name="calendar" size={16} color={colors.primary} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.dateInputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Ends</Text>
                                <View style={styles.dateValueRow}>
                                    <Text style={[styles.dateValue, { color: colors.text }]}>{endDate}</Text>
                                    <AppIcon library="Feather" name="calendar" size={16} color={colors.primary} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* 6. Bottom Sticky Publish Button */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.publishBtn, { backgroundColor: colors.primary }]}>
                    <AppIcon library="Feather" name="check" size={20} color="#FFF" />
                    <Text style={styles.publishBtnText}>Publish Promotion</Text>
                </TouchableOpacity>
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
    sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12 },

    // Preview Card
    previewCard: { flexDirection: 'row', borderRadius: 16, overflow: 'hidden', padding: 20, marginBottom: 32, position: 'relative' },
    previewLeft: { flex: 0.65, justifyContent: 'center', borderRightWidth: 2, borderRightColor: 'rgba(255,255,255,0.2)', paddingRight: 16, borderStyle: 'dashed' },
    badgeLabel: { backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
    badgeText: { color: '#000', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
    previewTitle: { color: '#FFF', fontSize: 18, fontWeight: '900', marginBottom: 4 },
    previewSub: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '500' },

    previewRight: { flex: 0.35, alignItems: 'center', justifyContent: 'center', paddingLeft: 16 },
    previewDiscount: { color: '#FFF', fontSize: 28, fontWeight: '900', marginBottom: -4 },
    previewOff: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
    codeBox: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    codeText: { color: '#FFF', fontSize: 11, fontWeight: '800', letterSpacing: 1 },

    scallopTop: { position: 'absolute', top: -10, right: '31%', width: 20, height: 20, borderRadius: 10 },
    scallopBottom: { position: 'absolute', bottom: -10, right: '31%', width: 20, height: 20, borderRadius: 10 },

    // Forms
    formSection: { marginBottom: 24 },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
    inputField: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },

    // Toggle
    toggleContainer: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, padding: 4, marginBottom: 12 },
    toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    toggleActive: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
    toggleText: { fontSize: 13, fontWeight: '700' },

    iconInputWrap: { flexDirection: 'row', alignItems: 'center', height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16 },
    inputIconText: { fontSize: 18, fontWeight: '800', marginRight: 8 },
    iconInputField: { flex: 1, fontSize: 16, fontWeight: '600' },

    // Target Chips
    chipsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
    chipText: { fontSize: 13, fontWeight: '600' },
    selectItemsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', gap: 8 },
    selectItemsText: { fontSize: 14, fontWeight: '700' },

    // Date Scheduling
    rowInputs: { flexDirection: 'row' },
    dateInputWrap: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 12 },
    dateLabel: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
    dateValueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dateValue: { fontSize: 14, fontWeight: '600' },

    // Footer
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1 },
    publishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16, gap: 10 },
    publishBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

export default CreatePromoScreen;