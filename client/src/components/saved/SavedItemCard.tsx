import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

import { SavedItem } from './types';

type SavedItemCardProps = {
    item: SavedItem;
    colors: {
        surface: string;
        border: string;
        text: string;
        textSecondary: string;
        primary: string;
    };
};

const OPEN_COLOR = '#22C55E';
const CLOSED_COLOR = '#EF4444';
const STAR_COLOR = '#F59E0B';
const WHITE = '#FFF';

const SavedItemCard = ({ item, colors }: SavedItemCardProps) => {
    const isProduct = item.type === 'Products';
    const statusColor = item.isOpen ? OPEN_COLOR : CLOSED_COLOR;
    const stockColor = item.inStock ? OPEN_COLOR : CLOSED_COLOR;

    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                {!isProduct && (
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                        <Text style={styles.statusText}>{item.isOpen ? 'OPEN' : 'CLOSED'}</Text>
                    </View>
                )}
            </View>

            <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                    <View style={styles.titleWrap}>
                        {isProduct && (
                            <Text style={[styles.brandText, { color: colors.textSecondary }]}>{item.brand}</Text>
                        )}
                        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                            {item.title}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.heartBtn}>
                        <AppIcon library="AntDesign" name="heart" size={20} color={CLOSED_COLOR} />
                    </TouchableOpacity>
                </View>

                <View style={styles.metaContainer}>
                    {!isProduct ? (
                        <>
                            <Text style={[styles.subtitleText, { color: colors.textSecondary }]} numberOfLines={1}>
                                {item.subtitle}
                            </Text>
                            <View style={styles.ratingRow}>
                                <AppIcon library="AntDesign" name="star" size={12} color={STAR_COLOR} />
                                <Text style={[styles.ratingText, { color: colors.text }]}>
                                    {item.rating}{' '}
                                    <Text style={[styles.reviewsText, { color: colors.textSecondary }]}>
                                        ({item.reviews})
                                    </Text>
                                </Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text style={[styles.priceText, { color: colors.text }]}>{item.price}</Text>
                            <Text style={[styles.stockText, { color: stockColor }]}>
                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </Text>
                        </>
                    )}
                </View>

                <View style={styles.actionRow}>
                    {isProduct ? (
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                            <AppIcon library="Feather" name="shopping-bag" size={14} color={WHITE} />
                            <Text style={styles.actionBtnText}>Add to Cart</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={[styles.actionBtnOutline, { borderColor: colors.border }]}>
                            <Text style={[styles.actionBtnOutlineText, { color: colors.text }]}>View Details</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
        padding: 12,
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    imageContainer: { position: 'relative' },
    cardImage: { width: 110, height: 110, borderRadius: 12 },
    statusBadge: { position: 'absolute', top: 6, left: 6, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
    statusText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
    cardInfo: { flex: 1, marginLeft: 16, justifyContent: 'space-between' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    titleWrap: { flex: 1, paddingRight: 8 },
    brandText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2, textTransform: 'uppercase' },
    cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    heartBtn: { padding: 4, marginRight: -4, marginTop: -4 },
    metaContainer: { marginBottom: 8 },
    subtitleText: { fontSize: 13, marginBottom: 6 },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { fontSize: 13, fontWeight: '700', marginLeft: 4 },
    reviewsText: { fontSize: 13, fontWeight: '400' },
    priceText: { fontSize: 16, fontWeight: '900', marginBottom: 4 },
    stockText: { fontSize: 11, fontWeight: '700' },
    actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, gap: 6 },
    actionBtnText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
    actionBtnOutline: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
    actionBtnOutlineText: { fontSize: 13, fontWeight: '700' },
});

export default SavedItemCard;
