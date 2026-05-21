import { AppIcon } from '@components/ui';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const NotificationsSafetyBox = () => {
    return (
        <View style={styles.safetyBox}>
            <View style={styles.safetyIconBg}>
                <AppIcon library="Feather" name="check-circle" size={18} color="#FFF" />
            </View>
            <View style={styles.safetyContent}>
                <Text style={styles.safetyTitle}>Safety First!</Text>
                <Text style={styles.safetyDesc}>
                    Only pay through AfroSpot for secure bookings. We'll never ask for your password via notification.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    safetyBox: {
        flexDirection: 'row',
        backgroundColor: '#D1FAE5',
        marginHorizontal: 20,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    safetyIconBg: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    safetyContent: { flex: 1 },
    safetyTitle: { fontSize: 14, fontWeight: '800', color: '#065F46', marginBottom: 4 },
    safetyDesc: { fontSize: 13, color: '#065F46', lineHeight: 18 },
});
