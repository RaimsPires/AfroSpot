import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

import { useAuth } from '@contexts/AuthContext';
import Share from 'react-native-share';
import { styles } from './styles';
import { ProfileHeaderProps } from './types';

export const ProfileHeader = ({ colors }: ProfileHeaderProps) => {
    const { active_spot } = useAuth();
    const handleShareProfile = async () => {
        const shareOptions = {
            title: 'Share Report',
            message: 'Take a look at this document.',
            url: 'file:///path/to/your/local/file.pdf', // Can be a web URL, local file path, or base64 URI
            type: 'application/pdf', // Specify the MIME type of the file
        };

        try {
            const shareResponse = await Share.open(shareOptions);
            console.log('Result:', shareResponse);
        } catch (error) {
            // Handles user canceling or errors
            console.log('Error or Cancel:', error);
        }
    };
    return (
        <View style={styles.profileHeader}>
            <Image source={{ uri: active_spot?.spot.logo }} style={styles.businessAvatar} />
            <View style={styles.businessInfo}>
                <Text style={[styles.businessName, { color: colors.text }]}>{active_spot?.spot.name}</Text>
                <Text style={[styles.businessEmail, { color: colors.textSecondary }]}>{active_spot?.spot.email}</Text>
                <View style={styles.ratingRow}>
                    <AppIcon library="AntDesign" name="star" size={14} color={colors.warning} />
                    <Text style={[styles.ratingText, { color: colors.text }]}>4.8 (128 Reviews)</Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={handleShareProfile}
                style={[styles.viewProfileBtn, { backgroundColor: colors.primary + '15' }]}>
                <AppIcon library="Feather" name="external-link" size={18} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );

}