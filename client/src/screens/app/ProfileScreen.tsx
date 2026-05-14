import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
} from 'react-native';

import { AppIcon } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LanguageBottomSheet from '@/components/profile/LanguageBottomSheet';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileMenuGroup from '@/components/profile/ProfileMenuGroup';
import ProfileMenuItem from '@/components/profile/ProfileMenuItem';
import ProfileUserInfo from '@/components/profile/ProfileUserInfo';

const ProfileScreen = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    const { signOut } = useAuth();
    const navigation = useNavigation<AppStackNavigationProp<'Profile'>>();
    const [showLanguageSheet, setShowLanguageSheet] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const handleSelectLanguage = (languageId: string) => {
        setSelectedLanguage(languageId);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <ProfileHeader colors={colors} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <ProfileUserInfo colors={colors} />

                {/* Account Menu Group */}
                <ProfileMenuGroup label="ACCOUNT" colors={colors}>
                    <ProfileMenuItem
                        icon="user"
                        label="Edit Profile"
                        colors={colors}
                        onPress={() => navigation.navigate('EditProfile')}
                    />
                    <ProfileMenuItem
                        icon="heart"
                        label="Saved Places & Products"
                        onPress={() => navigation.navigate('Saved')}
                        colors={colors}
                        isLast
                    />
                </ProfileMenuGroup>

                {/* History Menu Group */}
                <ProfileMenuGroup label="HISTORY" colors={colors}>
                    <ProfileMenuItem
                        icon="calendar"
                        label="Booking History"
                        colors={colors}
                        onPress={() => navigation.navigate('BookingHistory')}
                    />
                    <ProfileMenuItem
                        icon="shopping-bag"
                        label="Orders History"
                        colors={colors}
                        onPress={() => navigation.navigate('OrdersHistory')}
                    />
                    <ProfileMenuItem
                        icon="star"
                        label="Reviews Submitted"
                        colors={colors}
                        onPress={() => navigation.navigate('Reviews', { source: 'profile' })}
                        isLast
                    />
                </ProfileMenuGroup>

                {/* Preferences Menu Group */}
                <ProfileMenuGroup label="PREFERENCES" colors={colors}>
                    <ProfileMenuItem
                        icon="globe"
                        label="Language"
                        value="English"
                        colors={colors}
                        onPress={() => setShowLanguageSheet(true)}
                    />
                    <ProfileMenuItem
                        icon={isDark ? 'moon' : 'sun'}
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
                </ProfileMenuGroup>

                {/* Logout Button */}
                <TouchableOpacity
                    style={[styles.logoutBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={signOut}
                >
                    <AppIcon library="Feather" name="log-out" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={[styles.appVersion, { color: colors.textSecondary }]}>AfroSpot v1.0.0</Text>

            </ScrollView>

            <LanguageBottomSheet
                visible={showLanguageSheet}
                onClose={() => setShowLanguageSheet(false)}
                onSelectLanguage={handleSelectLanguage}
                currentLanguage={selectedLanguage}
                colors={colors}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 60 },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 16,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 10,
    },
    logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '800' },
    appVersion: { textAlign: 'center', marginTop: 32, fontSize: 12, fontWeight: '500' },
});

export default ProfileScreen;