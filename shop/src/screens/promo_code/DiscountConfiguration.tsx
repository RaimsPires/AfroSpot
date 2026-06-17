import { useTheme } from '@contexts/ThemeContext'
import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const DiscountConfiguration:React.FC<{ discountType:string, setDiscountType:(discount:'percentage' | 'fixed')=>void, discountValue:string, setDiscountValue:(discount:string)=>void }> = ({ discountType, setDiscountType, discountValue, setDiscountValue }) => {
    const { colors } = useTheme()
    return (
        <View style={styles.formSection}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DISCOUNT TYPE & VALUE</Text>

            <View style={[styles.toggleContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.toggleBtn, discountType === 'percentage' && [styles.toggleActive, { backgroundColor: colors.primary }]]}
                    onPress={() => setDiscountType('percentage')}
                >
                    <Text style={[styles.toggleText, { color: discountType === 'percentage' ? colors.textInverse : colors.textSecondary }]}>
                        Percentage (%)
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, discountType === 'fixed' && [styles.toggleActive, { backgroundColor: colors.primary }]]}
                    onPress={() => setDiscountType('fixed')}
                >
                    <Text style={[styles.toggleText, { color: discountType === 'fixed' ? colors.textInverse : colors.textSecondary }]}>
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
    )
}

export default DiscountConfiguration

const styles = StyleSheet.create({
    // Toggle
    toggleContainer: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, padding: 4, marginBottom: 12 },
    toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    toggleActive: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
    toggleText: { fontSize: 13, fontWeight: '700' },

    iconInputWrap: { flexDirection: 'row', alignItems: 'center', height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16 },
    inputIconText: { fontSize: 18, fontWeight: '800', marginRight: 8 },
    iconInputField: { flex: 1, fontSize: 16, fontWeight: '600' },

    formSection: { marginBottom: 24 },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
})