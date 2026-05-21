import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

type MapHeaderProps = {
    colors: {
        background: string;
        text: string;
        textSecondary: string;
        primary: string;
    };
};

const MapHeader = ({ colors }: MapHeaderProps) => {
    return (
        <View style={[styles.header, { backgroundColor: colors.background, zIndex: 10 }]}> 
            <View style={styles.headerLeft}>
                <View style={[styles.logoBox, { backgroundColor: colors.text }]}>
                    <AppIcon library="AntDesign" name="lightning-bolt" size={18} color={colors.background} />
                </View>
                <View>
                    <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>CURRENT LOCATION</Text>
                    <View style={styles.locationRow}>
                        <AppIcon library="Feather" name="map-pin" size={12} color={colors.primary} />
                        <Text style={[styles.locationText, { color: colors.primary }]}> Harlem, NY</Text>
                    </View>
                </View>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="search" size={20} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="layers" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logoBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    locationLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    locationText: { fontSize: 14, fontWeight: '800' },
    headerRight: { flexDirection: 'row', gap: 8 },
    iconBtn: { padding: 8 },
});

export default MapHeader;
