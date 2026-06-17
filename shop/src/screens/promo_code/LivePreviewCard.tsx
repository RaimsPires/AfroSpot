import { useTheme } from '@contexts/ThemeContext'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const LivePreviewCard: React.FC<{ discountType: string, title: string, appliesTo: string, discountValue: string, promoCode: string, setDiscountValue: (discount: string) => void }> = ({ discountType, title, appliesTo, discountValue, promoCode, setDiscountValue }) => {
    const { colors } = useTheme()
    return (
        <>
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
        </>
    )
}

export default LivePreviewCard

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12 },

    // Preview Card
    previewCard: { flexDirection: 'row', borderRadius: 16, overflow: 'hidden', padding: 20, marginBottom: 32, position: 'relative' },
    previewLeft: { flex: 0.65, justifyContent: 'center', borderRightWidth: 2, borderRightColor: 'rgba(255,255,255,0.2)', paddingRight: 16, borderStyle: 'dashed' },
    badgeLabel: { backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 8 },
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

})