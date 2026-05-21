import { AppIcon } from '@components/ui';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type NotificationsFABProps = {
    colors: any;
    onPress?: () => void;
};

export const NotificationsFAB = ({ colors, onPress }: NotificationsFABProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.fab,
                { backgroundColor: colors.primary, shadowColor: colors.primary },
            ]}
        >
            <AppIcon library="Feather" name="check-circle" size={24} color="#FFF" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
});
