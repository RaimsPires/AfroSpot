import { AppIcon } from '@components/ui';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { DashboardColors } from './types';

type QuickActionsRowProps = {
    colors: DashboardColors;
};

type QuickActionProps = {
    icon: string;
    label: string;
    colors: DashboardColors;
    onPress?: () => void;
};

type QuickActionItem = {
    key: string;
    icon: string;
    label: string;
    onPress: () => void;
};


const QuickAction = ({ icon, label, colors, onPress }: QuickActionProps) => (
    <TouchableOpacity style={styles.quickActionBtn} onPress={onPress}>
        <View style={[styles.quickActionIconBg, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AppIcon library="Feather" name={icon} size={25} color={colors.text} />
        </View>
        <Text style={[styles.quickActionLabel, { color: colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
);

const QuickActionsSeparator = () => <View style={styles.quickActionsSeparator} />;

export const QuickActionsRow = ({ colors }: QuickActionsRowProps) => {
    const navigation = useNavigation<any>();
    const quickActions: QuickActionItem[] = [
        { key: 'services', icon: 'settings', label: 'Services', onPress: () => navigation.navigate('ManageServices') },
        { key: 'products', icon: 'box', label: 'Products', onPress: () => navigation.navigate('ManageProducts') },
        { key: 'promo', icon: 'tag', label: 'Create Promo', onPress: () => navigation.navigate('CreatePromo') },
        { key: 'reports', icon: 'bar-chart-2', label: 'Reports', onPress: () => navigation.navigate('StoreAnalytics') },
        { key: 'store', icon: 'shopping-bag', label: 'Store', onPress: () => navigation.navigate('StoreStack') },
    ];

    return (
        <View style={styles.quickActionsContainer}>
            <FlatList
                data={quickActions}
                horizontal
                keyExtractor={(item) => item.key}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickActionsListContent}
                ItemSeparatorComponent={QuickActionsSeparator}
                renderItem={({ item }) => (
                    <QuickAction icon={item.icon} label={item.label} colors={colors} onPress={item.onPress} />
                )}
            />
        </View>
    );
};
