import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const APPLIES_TO_OPTIONS = ['All Services', 'All Products', 'Specific Items'];

const TargetAndScheduling: React.FC<{ appliesTo: string, setAppliesTo: (appliend_to: string) => void }> = ({ appliesTo, setAppliesTo }) => {
    const { colors } = useTheme()
    return (
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
    )
}

export default TargetAndScheduling

const styles = StyleSheet.create({
    formSection: { marginBottom: 24 },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
    inputField: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },


    chipsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
    chipText: { fontSize: 13, fontWeight: '600' },
    selectItemsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', gap: 8 },
    selectItemsText: { fontSize: 14, fontWeight: '700' },
})