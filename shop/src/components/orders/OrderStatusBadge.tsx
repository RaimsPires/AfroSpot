import { useTheme } from '@contexts/ThemeContext';
import type { OrderLifecycleStatus } from '@type/commerce';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type OrderStatusBadgeProps = {
    status: OrderLifecycleStatus;
};

const getBadgeColors = (status: OrderLifecycleStatus, colors: ReturnType<typeof useTheme>['colors']) => {
    switch (status) {
        case 'Pending':
            return { backgroundColor: '#F59E0B15', textColor: '#B45309' };
        case 'Confirmed':
            return { backgroundColor: colors.primary + '15', textColor: colors.primary };
        case 'Shipped':
            return { backgroundColor: '#2563EB15', textColor: '#2563EB' };
        case 'Completed':
            return { backgroundColor: '#16A34A15', textColor: '#15803D' };
        case 'Cancelled':
            return { backgroundColor: colors.destructiveSurface, textColor: colors.destructive };
        default:
            return { backgroundColor: colors.surface, textColor: colors.textSecondary };
    }
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
    const { colors } = useTheme();
    const badgeColors = getBadgeColors(status, colors);

    return (
        <View style={[styles.badge, { backgroundColor: badgeColors.backgroundColor }]}> 
            <Text style={[styles.badgeText, { color: badgeColors.textColor }]}>{status}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
    },
});

export default OrderStatusBadge;
