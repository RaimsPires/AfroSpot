import { AppIcon } from '@components/ui';
import React from 'react';
import { Text, View } from 'react-native';

import { styles } from './styles';
import { DashboardColors, DashboardStats } from './types';

type StatsRowProps = {
    colors: DashboardColors;
    stats: DashboardStats;
};

export const StatsRow = ({ colors, stats }: StatsRowProps) => (
    <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.statIconBg, { backgroundColor: colors.primary + '15' }]}>
                <AppIcon library="Feather" name="calendar" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.bookings}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>New Bookings</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.statIconBg, { backgroundColor: colors.successSurface }]}>
                <AppIcon library="Feather" name="eye" size={18} color={colors.success} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.profileViews}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Profile Views</Text>
        </View>
    </View>
);
