import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';

// --- Mock User Data ---
const USER_DATA = {
    name: 'Amara Okoro',
    email: 'amara.okoro@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://i.pravatar.cc/150?img=47',
    memberSince: 'Member since 2023',
};

const ProfileScreen = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    // Assuming your ThemeContext provides a toggleTheme function. 
    // If not, you can replace it with a local state for the visual toggle.

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 2. User Info Section */}
                <View style={styles.userInfoContainer}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: USER_DATA.avatar }} style={styles.avatar} />
                        <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: colors.primary, borderColor: colors.background }]}>
                            <AppIcon library="Feather" name="camera" size={14} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.userName, { color: colors.text }]}>{USER_DATA.name}</Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{USER_DATA.email}</Text>
                    <View style={[styles.memberBadge, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.memberText, { color: colors.textSecondary }]}>{USER_DATA.memberSince}</Text>
                    </View>
                </View>

                {/* 3. Menu Group: Account */}
                <View style={styles.menuGroup}>
                    <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>ACCOUNT</Text>
                    <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MenuItem icon="user" label="Edit Profile" colors={colors} />
                        <MenuItem icon="heart" label="Saved Places & Products" colors={colors} isLast />
                    </View>
                </View>

                {/* 4. Menu Group: History */}
                <View style={styles.menuGroup}>
                    <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>HISTORY</Text>
                    <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MenuItem icon="calendar" label="Booking History" colors={colors} />
                        <MenuItem icon="shopping-bag" label="Orders History" colors={colors} />
                        <MenuItem icon="star" label="Reviews Submitted" colors={colors} isLast />
                    </View>
                </View>

                {/* 5. Menu Group: Settings & Preferences */}
                <View style={styles.menuGroup}>
                    <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>PREFERENCES</Text>
                    <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <MenuItem
                            icon="globe"
                            label="Language"
                            value="English"
                            colors={colors}
                        />
                        <MenuItem
                            icon={isDark ? "moon" : "sun"}
                            label="Dark Mode"
                            colors={colors}
                            isLast
                            rightElement={
                                <Switch
                                    value={isDark}
                                    onValueChange={toggleTheme}
                                    trackColor={{ false: '#D1D5DB', true: colors.primary + '80' }}
                                    thumbColor={isDark ? colors.primary : '#FFF'}
                                />
                            }
                        />
                    </View>
                </View>

                {/* 6. Logout Button */}
                <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <AppIcon library="Feather" name="log-out" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={[styles.appVersion, { color: colors.textSecondary }]}>AfroSpot v1.0.0</Text>

            </ScrollView>
        </SafeAreaView>
    );
};

// --- Sub Components ---

const MenuItem = ({ icon, label, value, isLast, rightElement, colors }: any) => (
    <TouchableOpacity
        style={[
            styles.menuItem,
            !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }
        ]}
        disabled={!!rightElement} // Disable touch if it has a switch (let the switch handle touches)
    >
        <View style={[styles.menuIconBg, { backgroundColor: colors.primary + '15' }]}>
            <AppIcon library="Feather" name={icon} size={18} color={colors.primary} />
        </View>
        <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>

        <View style={styles.menuRight}>
            {value && <Text style={[styles.menuValue, { color: colors.textSecondary }]}>{value}</Text>}
            {rightElement ? (
                rightElement
            ) : (
                <AppIcon library="Feather" name="chevron-right" size={20} color={colors.textSecondary} />
            )}
        </View>
    </TouchableOpacity>
);

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800' },

    scrollContent: { paddingBottom: 60 },

    // User Info
    userInfoContainer: { alignItems: 'center', paddingVertical: 32 },
    avatarWrapper: { position: 'relative', marginBottom: 16 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
    userName: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
    userEmail: { fontSize: 14, marginBottom: 12 },
    memberBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    memberText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

    // Menu Groups
    menuGroup: { paddingHorizontal: 20, marginBottom: 24 },
    groupLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 8, marginLeft: 8 },
    groupCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },

    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    menuIconBg: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
    menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    menuValue: { fontSize: 14, fontWeight: '500' },

    // Logout
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 16, paddingVertical: 16, borderRadius: 16, borderWidth: 1, gap: 10 },
    logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '800' },

    // Version
    appVersion: { textAlign: 'center', marginTop: 32, fontSize: 12, fontWeight: '500' },
});

export default ProfileScreen;