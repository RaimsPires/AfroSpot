import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

export const CURRENCY_OPTIONS = [
    { code: 'USD', label: 'US Dollar ($)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'GBP', label: 'British Pound (£)' },
    { code: 'NGN', label: 'Nigerian Naira (N)' },
    { code: 'AOA', label: 'Angolan Kwanza (Kz)' },
] as const;

type CurrencyBottomSheetProps = {
    selectedCurrency: string;
    onSelectCurrency: (currencyCode: string) => void;
    onClose: () => void;
};

export const CurrencyBottomSheet = ({ selectedCurrency, onSelectCurrency, onClose }: CurrencyBottomSheetProps) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.sheet, { backgroundColor: colors.background }]}> 
            <View style={[styles.header, { borderBottomColor: colors.border }]}> 
                <Text style={[styles.title, { color: colors.text }]}>Select Currency</Text>
                <TouchableOpacity onPress={onClose}>
                    <AppIcon library="Feather" name="x" size={22} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {CURRENCY_OPTIONS.map((currency) => {
                    const selected = selectedCurrency === currency.code;
                    return (
                        <TouchableOpacity
                            key={currency.code}
                            style={[
                                styles.row,
                                {
                                    borderColor: colors.border,
                                    backgroundColor: selected ? colors.primary + '15' : colors.surface,
                                },
                            ]}
                            onPress={() => onSelectCurrency(currency.code)}
                        >
                            <View>
                                <Text style={[styles.rowCode, { color: selected ? colors.primary : colors.text }]}>{currency.code}</Text>
                                <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{currency.label}</Text>
                            </View>
                            {selected ? <AppIcon library="Feather" name="check" size={16} color={colors.primary} /> : null}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    sheet: {
        height: '60%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: { fontSize: 16, fontWeight: '800' },
    list: { padding: 20, gap: 10 },
    row: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowCode: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
    rowLabel: { fontSize: 12, fontWeight: '500' },
});
