import { AppIcon } from '@components/ui';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';
import { DashboardColors } from './types';

type DashboardHeaderProps = {
    colors: DashboardColors;
    onNotificationsPress: () => void;
    onProfilePress: () => void;
};

export const DashboardHeader = ({ colors, onNotificationsPress, onProfilePress }: DashboardHeaderProps) => (
    <View style={[styles.header, { backgroundColor: colors.background }]}> 
        <View>
            <Text style={[styles.greetingText, { color: colors.textSecondary }]}>Good Morning,</Text>
            <Text style={[styles.businessName, { color: colors.text }]}>Kushite Cutz & Styles</Text>
        </View>
        <View style={styles.headerRight}>
            <TouchableOpacity onPress={onNotificationsPress} style={[styles.iconBtn, { backgroundColor: colors.surface }]}>
                <AppIcon library="Feather" name="bell" size={20} color={colors.text} />
                <View style={[styles.notificationBadge, { backgroundColor: colors.destructive, borderColor: colors.background }]} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.surface }]} onPress={onProfilePress}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200' }} style={[styles.shopAvatar, { borderColor: colors.border }]} />
            </TouchableOpacity>
        </View>
    </View>
);
