import { AppIcon } from '@components/ui'
import { useTheme } from '@contexts/ThemeContext'
import { ProductData } from '@type/product'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const RenderProductItem: React.FC<{ product:ProductData,onEdit:()=>void,onDelete:()=>void }> = ({ product , onDelete , onEdit }) => {
    const { colors } = useTheme()
        const getStockColor = (count: number) => {
            if (count === 0) return colors.destructive;
            if (count < 5) return colors.warning;
            return colors.success;
        };
        
    return (
        <View key={product.id} style={[styles.productCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardContentRow}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={[styles.productTitle, { color: colors.text }]} numberOfLines={1}>{product.name}</Text>
                    <Text style={[styles.productPrice, { color: colors.primary }]}>${product.price}</Text>

                    <View style={styles.stockRow}>
                        <View style={[styles.stockIndicator, { backgroundColor: getStockColor(product.stock_quantity) }]} />
                        <Text style={[styles.stockText, { color: colors.textSecondary }]}>
                            {product.stock_quantity === 0 ? 'Out of stock' : `${product.stock_quantity} in stock`}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
                    <AppIcon library="Feather" name="edit-2" size={16} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
                    <AppIcon library="Feather" name="trash-2" size={16} color={colors.destructive} />
                    <Text style={[styles.actionText, { color: colors.destructive }]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default RenderProductItem

const styles = StyleSheet.create({
    productCard: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
    cardContentRow: { flexDirection: 'row', padding: 16 },
    productImage: { width: 80, height: 80, borderRadius: 12, marginRight: 16 },
    productInfo: { flex: 1, justifyContent: 'center' },
    productTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    productPrice: { fontSize: 18, fontWeight: '900', marginBottom: 8 },

    stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    stockIndicator: { width: 8, height: 8, borderRadius: 4 },
    stockText: { fontSize: 13, fontWeight: '600' },

    divider: { height: 1, width: '100%' },

    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingVertical: 12, gap: 20 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    actionText: { fontSize: 13, fontWeight: '700' },
})