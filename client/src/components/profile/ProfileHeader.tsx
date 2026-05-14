import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ProfileHeaderProps = {
    colors: {
        background: string;
        text: string;
    };
};

const ProfileHeader = ({ colors }: ProfileHeaderProps) => (
    <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
    </View>
);

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: '800' },
});

export default ProfileHeader;
