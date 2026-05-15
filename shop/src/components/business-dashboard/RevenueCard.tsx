import { AppIcon } from '@components/ui';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';
import { DashboardColors, DashboardStats } from './types';

type RevenueCardProps = {
    colors: DashboardColors;
    stats: DashboardStats;
};

export const RevenueCard = ({ colors, stats }: RevenueCardProps) => (
    <View style={[styles.revenueCard, { backgroundColor: colors.primary }]}> 
        <View style={styles.revenueHeader}>
            <Text style={styles.revenueLabel}>TOTAL REVENUE (THIS MONTH)</Text>
            <TouchableOpacity>
                <AppIcon library="Feather" name="more-horizontal" size={20} color={colors.textInverse} />
            </TouchableOpacity>
        </View>
        <View style={styles.revenueBody}>
            <Text style={styles.revenueAmount}>{stats.revenue}</Text>
            <View style={[styles.growthBadge, { backgroundColor: colors.successSurface }]}>
                <AppIcon library="Feather" name="trending-up" size={12} color={colors.success} />
                <Text style={[styles.growthText, { color: colors.success }]}>{stats.revenueGrowth}</Text>
            </View>
        </View>
        <View style={styles.revenueFooter}>
            <Text style={styles.revenueFooterText}>Next payout: Oct 28 • $1,240.00</Text>
        </View>
    </View>
);
