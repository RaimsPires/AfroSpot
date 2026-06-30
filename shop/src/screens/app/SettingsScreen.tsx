import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LanguageBottomSheet } from '@components/settings/LanguageBottomSheet';
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const SettingsScreen = ({ navigation }: any) => {
    const { colors, isDark, toggleTheme } = useTheme();

    // Mock states for toggle settings
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [locationServices, setLocationServices] = useState(true);
    
    const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
    const [languageSheetVisible, setLanguageSheetVisible] = useState(false);
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

    const handleDeleteAccount = () => {
        setDeleteConfirmVisible(true);
    };

    const confirmDeleteAccount = () => {
        setDeleteConfirmVisible(false);
        console.log('Account deleted');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
                <View style={{ width: 40 }} /> {/* Spacer to center title */}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 2. Account Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT</Text>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <SettingsItem icon="user" label="Personal Information" colors={colors} onPress={() => navigation.navigate('PersonalInfo')} />
                        <SettingsItem icon="lock" label="Password & Security" colors={colors} onPress={() => navigation.navigate('PasswordSecurity')} />
                        <SettingsItem icon="credit-card" label="Payment Methods" colors={colors} isLast onPress={() => navigation.navigate('PaymentMethods')} />
                    </View>
                </View>

                {/* 3. Notifications Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NOTIFICATIONS</Text>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <SettingsItem
                            icon="bell"
                            label="Push Notifications"
                            colors={colors}
                            rightElement={
                                <Switch
                                    value={pushNotifications}
                                    onValueChange={setPushNotifications}
                                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                                    thumbColor={pushNotifications ? colors.primary : colors.surfaceElevated}
                                />
                            }
                        />
                        <SettingsItem
                            icon="mail"
                            label="Email Notifications"
                            colors={colors}
                            isLast
                            rightElement={
                                <Switch
                                    value={emailNotifications}
                                    onValueChange={setEmailNotifications}
                                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                                    thumbColor={emailNotifications ? colors.primary : colors.surfaceElevated}
                                />
                            }
                        />
                    </View>
                </View>

                {/* 4. Preferences Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <SettingsItem
                            icon="map-pin"
                            label="Location Services"
                            colors={colors}
                            rightElement={
                                <Switch
                                    value={locationServices}
                                    onValueChange={setLocationServices}
                                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                                    thumbColor={locationServices ? colors.primary : colors.surfaceElevated}
                                />
                            }
                        />
                        <SettingsItem icon="globe" label="Language" value={selectedLanguage} colors={colors} onPress={() => setLanguageSheetVisible(true)} />
                        <SettingsItem
                            icon={isDark ? "moon" : "sun"}
                            label="Dark Theme"
                            colors={colors}
                            isLast
                            rightElement={
                                <Switch
                                    value={isDark}
                                    onValueChange={toggleTheme}
                                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                                    thumbColor={isDark ? colors.primary : colors.surfaceElevated}
                                />
                            }
                        />
                    </View>
                </View>

                {/* 5. Support Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SUPPORT & ABOUT</Text>
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <SettingsItem icon="help-circle" label="Help Center & FAQ" colors={colors} onPress={() => navigation.navigate('HelpCenter')} />
                        <SettingsItem icon="message-square" label="Contact Support" colors={colors} onPress={() => navigation.navigate('ContactSupport')} />
                        <SettingsItem icon="file-text" label="Terms of Service" colors={colors} onPress={() => navigation.navigate('TermsOfService')} />
                        <SettingsItem icon="shield" label="Privacy Policy" colors={colors} isLast onPress={() => navigation.navigate('PrivacyPolicy')} />
                    </View>
                </View>

                {/* 6. Destructive Actions */}
                <View style={[styles.section, { marginTop: 16 }]}>
                    <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: colors.destructiveSurface, borderColor: colors.destructive }]} onPress={handleDeleteAccount}>
                        <AppIcon library="Feather" name="trash-2" size={18} color={colors.destructive} />
                        <Text style={[styles.deleteBtnText, { color: colors.destructive }]}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.appVersion, { color: colors.textSecondary }]}>AfroSpot App v1.0.0 (Build 42)</Text>

            </ScrollView>

            {/* Modals */}
            <Modal
                visible={languageSheetVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setLanguageSheetVisible(false)}
            >
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setLanguageSheetVisible(false)} />
                <LanguageBottomSheet
                    selectedLanguage={selectedLanguage}
                    onSelectLanguage={(language) => {
                        setSelectedLanguage(language);
                        setLanguageSheetVisible(false);
                    }}
                    onClose={() => setLanguageSheetVisible(false)}
                />
            </Modal>

            <Modal
                visible={deleteConfirmVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDeleteConfirmVisible(false)}
            >
                <View style={[styles.confirmOverlay, { backgroundColor: colors.overlay }]}> 
                    <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={() => setDeleteConfirmVisible(false)} />
                    <View style={[styles.confirmCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                        <Text style={[styles.confirmTitle, { color: colors.text }]}>Delete Account?</Text>
                        <Text style={[styles.confirmMessage, { color: colors.textSecondary }]}>This action is permanent and cannot be undone. All your account data will be removed.</Text>

                        <View style={styles.confirmActionsRow}>
                            <TouchableOpacity
                                style={[styles.cancelBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
                                onPress={() => setDeleteConfirmVisible(false)}
                            >
                                <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.confirmDeleteBtn, { backgroundColor: colors.destructive }]}
                                onPress={confirmDeleteAccount}
                            >
                                <Text style={[styles.confirmDeleteBtnText, { color: colors.textInverse }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// --- Reusable Settings Item Component ---
const SettingsItem = ({ icon, label, value, isLast, rightElement, colors, onPress }: any) => (
    <TouchableOpacity
        style={[
            styles.itemContainer,
            !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }
        ]}
        disabled={!!rightElement}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.itemLeft}>
            <View style={[styles.iconBg, { backgroundColor: colors.primary + '15' }]}>
                <AppIcon library="Feather" name={icon} size={18} color={colors.primary} />
            </View>
            <Text style={[styles.itemLabel, { color: colors.text }]}>{label}</Text>
        </View>

        <View style={styles.itemRight}>
            {value && <Text style={[styles.itemValue, { color: colors.textSecondary }]}>{value}</Text>}

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
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },

    scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 },

    // Sections & Cards
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, marginLeft: 16, marginBottom: 8 },
    card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },

    // Items
    itemContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 },
    itemLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBg: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    itemLabel: { fontSize: 15, fontWeight: '600' },
    itemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    itemValue: { fontSize: 14, fontWeight: '500' },

    // Delete Action
    deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, borderWidth: 1, gap: 8 },
    deleteBtnText: { fontSize: 15, fontWeight: '700' },

    confirmOverlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
    confirmCard: {
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderBottomWidth: 0,
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    confirmTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    confirmMessage: { fontSize: 13, fontWeight: '500', lineHeight: 20, marginBottom: 16 },
    confirmActionsRow: { flexDirection: 'row', gap: 10 },
    cancelBtn: { flex: 1, borderWidth: 1, borderRadius: 12, alignItems: 'center', paddingVertical: 12 },
    cancelBtnText: { fontSize: 14, fontWeight: '700' },
    confirmDeleteBtn: { flex: 1, borderRadius: 12, alignItems: 'center', paddingVertical: 12 },
    confirmDeleteBtnText: { fontSize: 14, fontWeight: '800' },

    // Version
    appVersion: { textAlign: 'center', marginTop: 16, marginBottom: 32, fontSize: 12, fontWeight: '500' },
});

export default SettingsScreen;