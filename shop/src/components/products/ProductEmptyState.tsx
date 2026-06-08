import { AppIcon } from '@components/ui'
import { useTheme } from '@contexts/ThemeContext'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const ProductEmptyState: React.FC<{ openAddModal: () => void }> = ({ openAddModal }) => {
    const { colors } = useTheme()
    return (
        <View style={styles.emptyState}>
            <View style={[styles.emptyIconBg, { backgroundColor: colors.surface }]}>
                <AppIcon library="Feather" name="package" size={32} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Products Yet</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Add physical or digital products to sell in the AfroSpot marketplace.</Text>
            <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: colors.primary }]} onPress={openAddModal}>
                <Text style={[styles.emptyBtnText, { color: colors.textInverse }]}>Add First Product</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ProductEmptyState

const styles = StyleSheet.create({
    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 20 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    emptyBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 },
    emptyBtnText: { fontSize: 15, fontWeight: '800' },


})