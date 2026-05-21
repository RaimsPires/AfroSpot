import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

import { styles } from './styles';
import { ProfileHeaderProps } from './types';

export const ProfileHeader = ({ colors }: ProfileHeaderProps) => (
    <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200' }} style={styles.businessAvatar} />
        <View style={styles.businessInfo}>
            <Text style={[styles.businessName, { color: colors.text }]}>Kushite Cutz & Styles</Text>
            <Text style={[styles.businessEmail, { color: colors.textSecondary }]}>admin@kushitecutz.com</Text>
            <View style={styles.ratingRow}>
                <AppIcon library="AntDesign" name="star" size={14} color={colors.warning} />
                <Text style={[styles.ratingText, { color: colors.text }]}>4.8 (128 Reviews)</Text>
            </View>
        </View>
        <TouchableOpacity style={[styles.viewProfileBtn, { backgroundColor: colors.primary + '15' }]}>
            <AppIcon library="Feather" name="external-link" size={18} color={colors.primary} />
        </TouchableOpacity>
    </View>
);
