import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ExploreSectionHeaderProps = {
    title: string;
    subtitle?: string;
    showViewAll?: boolean;
    onViewAll?: () => void;
    colors: {
        text: string;
        textSecondary: string;
        primary: string;
    };
};

const ExploreSectionHeader = ({
    title,
    subtitle,
    showViewAll,
    onViewAll,
    colors,
}: ExploreSectionHeaderProps) => (
    <View style={styles.sectionHeader}>
        <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            {subtitle && <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
        {showViewAll && (
            <TouchableOpacity onPress={onViewAll}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
        )}
    </View>
);

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 16,
        marginTop: 32,
    },
    sectionTitle: { fontSize: 20, fontWeight: '900' },
    sectionSubtitle: { fontSize: 13, marginTop: 4 },
    viewAllText: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
});

export default ExploreSectionHeader;
