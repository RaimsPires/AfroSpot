import { AppIcon } from '@components/ui'
import { useTheme } from '@contexts/ThemeContext'
import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const BasicInfoForm: React.FC<{ title: string, setTitle: (title: string) => void, promoCode: string, setPromoCode: (promo_code: string) => void, startDate: string, endDate: string, setEndDate: (date: Date) => void, setStartDate: (date: Date) => void }> = ({ title, setTitle, promoCode, setPromoCode, startDate, endDate }) => {
    const { colors } = useTheme()
    return (
        <>
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
        </>
    )
}

export default BasicInfoForm

const styles = StyleSheet.create({
    formSection: { marginBottom: 24 },
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
    inputField: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },


    rowInputs: { flexDirection: 'row' },
    dateInputWrap: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 12 },
    dateLabel: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
    dateValueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dateValue: { fontSize: 14, fontWeight: '600' },
})