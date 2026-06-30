import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TARGET_MAP: Record<string, string> = {
    'all_services': 'All Services',
    'all_products': 'All Products',
    'specific_items': 'Specific Items',
};

type Props = {
    appliesTo: string; // This expects the backend key (e.g., 'all_services')
    setAppliesTo: (applied_to: string) => void;
    onOpenSpecificItems: () => void;
    selectedCount: number;
};

const TargetAndScheduling: React.FC<Props> = ({ appliesTo, setAppliesTo, onOpenSpecificItems, selectedCount }) => {
    const { colors } = useTheme()
    return (
        <View style={styles.formSection}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>APPLIES TO</Text>
            <View style={styles.chipsWrapper}>
                {Object.entries(TARGET_MAP).map(([key, label]) => {
                    const isActive = appliesTo === key;
                    return (
                        <TouchableOpacity
                            key={key}
                            onPress={() => setAppliesTo(key)} // 🚀 Set the backend key
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: isActive ? colors.primary + '15' : colors.surface,
                                    borderColor: isActive ? colors.primary : colors.border,
                                }
                            ]}
                        >
                            <Text style={[styles.chipText, { color: isActive ? colors.primary : colors.text }]}>
                                {label} {/* Display the human label */}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {appliesTo === 'specific_items' && (
                <TouchableOpacity
                    onPress={onOpenSpecificItems}
                    style={[styles.selectItemsBtn, { borderColor: colors.primary, backgroundColor: colors.primary + '05' }]}
                >
                    <AppIcon library="Feather" name={selectedCount > 0 ? "edit-2" : "plus-circle"} size={16} color={colors.primary} />
                    <Text style={[styles.selectItemsText, { color: colors.primary }]}>
                        {selectedCount > 0 ? `${selectedCount} Items Selected` : 'Select Products/Services'}
                    </Text>
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