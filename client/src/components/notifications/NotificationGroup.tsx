import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NotificationGroupProps } from './types';

export const NotificationGroup = ({ title, children, colors }: NotificationGroupProps) => {
    return (
        <View style={styles.groupContainer}>
            <View style={styles.groupHeader}>
                <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>{title}</Text>
                <TouchableOpacity>
                    <Text style={[styles.markReadText, { color: colors.primary }]}>Mark read</Text>
                </TouchableOpacity>
            </View>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    groupContainer: { marginBottom: 24 },
    groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
    groupTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    markReadText: { fontSize: 12, fontWeight: '700' },
});
