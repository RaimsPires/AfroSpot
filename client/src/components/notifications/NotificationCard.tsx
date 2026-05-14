import { AppIcon } from '@/components/ui';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NotificationCardProps } from './types';

export const NotificationCard = ({
    icon,
    iconColor,
    iconBg,
    title,
    time,
    description,
    image,
    actions,
    showChevron,
    onPress,
    colors,
}: NotificationCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.92}
            disabled={!onPress}
            onPress={onPress}
            style={[styles.cardContainer, { borderBottomColor: colors.border }]}
        >
            <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                <AppIcon library="Feather" name={icon} size={20} color={iconColor} />
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
                    <View style={styles.timeRow}>
                        <AppIcon library="Feather" name="clock" size={10} color={colors.textSecondary} />
                        <Text style={[styles.cardTime, { color: colors.textSecondary }]}> {time}</Text>
                    </View>
                </View>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{description}</Text>

                {image && <Image source={{ uri: image }} style={styles.cardImage} />}

                {actions && <View style={styles.actionsContainer}>{actions}</View>}
            </View>
            {showChevron && (
                <View style={styles.chevronContainer}>
                    <AppIcon library="Feather" name="chevron-right" size={18} color={colors.textSecondary} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
    iconContainer: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    cardContent: { flex: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    cardTitle: { fontSize: 15, fontWeight: '800', flex: 1, paddingRight: 8 },
    timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    cardTime: { fontSize: 11, fontWeight: '600' },
    cardDesc: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
    cardImage: { width: '100%', height: 120, borderRadius: 12, marginTop: 8, marginBottom: 12 },
    actionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
    chevronContainer: { paddingLeft: 12, justifyContent: 'center' },
});
