import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';

const HomeTopHeader = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<AppStackNavigationProp<'Home'>>();
    const { user } = useAuth();
    const hasActiveAddress = Boolean(user?.active_address);
    console.log(user?.profile_picture);
    console.log(user);

    return (
        <View style={styles.header}>
            <View style={styles.topRow}>
                <View style={styles.locationSlot}>
                    {hasActiveAddress ? (
                        <TouchableOpacity style={styles.locationRow} onPress={() => navigation.navigate('DeliveryAddresses')}>
                            <View style={styles.logoIcon}>
                                <AppIcon library="Feather" name="map-pin" size={16} color={colors.primary} />
                            </View>
                            <View style={styles.locationContent}>
                                <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>CURRENT LOCATION</Text>
                                <Text numberOfLines={1} style={[styles.cityName, { color: colors.text }]}>{user?.active_address}</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.addLocationBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => navigation.navigate('DeliveryAddresses')}
                        >
                            <AppIcon library="Feather" name="plus-circle" size={16} color={colors.primary} />
                            <Text style={[styles.addLocationText, { color: colors.text }]}>Add location</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.cartBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => navigation.navigate('Cart')}
                >
                    <AppIcon library="Feather" name="shopping-cart" size={20} color={colors.text} />
                    <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.cartBadgeText}>3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.profileButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => navigation.navigate('Profile')}
            >
                <Image
                    source={{ uri: user?.profile_picture || 'https://i.pravatar.cc/150?img=47' }}
                    style={styles.profileAvatar}
                />
                <View style={styles.profileTextWrap}>
                    <Text style={[styles.profileLabel, { color: colors.textSecondary }]}>PROFILE</Text>
                    <Text numberOfLines={1} style={[styles.profileName, { color: colors.text }]}>{user?.full_name || 'View profile'}</Text>
                </View>
                <AppIcon library="Feather" name="chevron-right" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: { padding: 16, gap: 10 },
    topRow: { flexDirection: 'row', alignItems: 'center' },
    locationSlot: { flex: 1, marginRight: 8 },
    locationRow: { flexDirection: 'row', alignItems: 'center' },
    locationContent: { flex: 1 },
    logoIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    locationLabel: { fontSize: 10, fontWeight: '800' },
    cityName: { fontWeight: '700', fontSize: 14 },
    addLocationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 8,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    addLocationText: { fontSize: 13, fontWeight: '700' },
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
        width: '100%',
    },
    profileAvatar: { width: 34, height: 34, borderRadius: 17 },
    profileTextWrap: { justifyContent: 'center', flex: 1 },
    profileLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    profileName: { fontSize: 13, fontWeight: '700' },
});

export default HomeTopHeader;
