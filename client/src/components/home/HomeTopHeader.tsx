import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';

const HomeTopHeader = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<AppStackNavigationProp<'Home'>>();

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.locationRow} onPress={() => navigation.navigate('DeliveryAddresses')}>
                <View style={[styles.logoIcon]}>
                    <AppIcon library="Feather" name="map-pin" size={16} color={colors.primary} />
                </View>
                <View>
                    <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>CURRENT LOCATION</Text>
                    <Text style={[styles.cityName, { color: colors.text }]}> Brixton, London</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.rightRow}>
                <TouchableOpacity
                    style={[styles.cartBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => navigation.navigate('Cart')}
                >
                    <AppIcon library="Feather" name="shopping-cart" size={20} color={colors.text} />
                    <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.cartBadgeText}>3</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.profileButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?img=47' }}
                        style={styles.profileAvatar}
                    />
                    <View style={styles.profileTextWrap}>
                        <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>PROFILE</Text>
                        <Text style={[styles.profileName, { color: colors.text }]}>Amara</Text>
                    </View>
                    <AppIcon library="Feather" name="chevron-right" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: { flexDirection: 'row', padding: 16, justifyContent: 'space-between', alignItems: 'center' },
    locationRow: { flexDirection: 'row', alignItems: 'center', },
    logoIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    locationLabel: { fontSize: 10, fontWeight: '800' },
    cityRow: { flexDirection: 'row', alignItems: 'center' },
    cityName: { fontWeight: '700', fontSize: 14 },
    rightRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cartBtn: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    cartBadge: { position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
    cartBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 14,
        borderWidth: 1,
    },
    profileAvatar: { width: 34, height: 34, borderRadius: 17 },
    profileTextWrap: { justifyContent: 'center' },
    profileLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    profileName: { fontSize: 13, fontWeight: '700' },
});

export default HomeTopHeader;
