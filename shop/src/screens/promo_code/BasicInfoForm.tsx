import { DatePickerField } from '@components/ui'
import { useTheme } from '@contexts/ThemeContext'
import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

const BasicInfoForm: React.FC<{ title: string, setTitle: (title: string) => void, promoCode: string, setPromoCode: (promo_code: string) => void, startDate: Date, endDate: Date, setEndDate: (date: Date) => void, setStartDate: (date: Date) => void }> = ({ title, setTitle, promoCode, setPromoCode, startDate, endDate, setEndDate, setStartDate }) => {
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
                <View >
                    <DatePickerField
                        minimumDate={new Date()}
                        variant='bottomSheet'
                        onChange={(date) => {
                            setStartDate(date)
                        }}
                        value={startDate}
                    />
                    <DatePickerField
                        minimumDate={startDate}
                        onChange={(date) => {
                            setEndDate(date)
                        }}
                        value={endDate}
                    />
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
})