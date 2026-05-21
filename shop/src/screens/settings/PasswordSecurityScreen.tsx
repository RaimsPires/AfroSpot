import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const ACTIVE_SESSIONS = [
    { id: '1', device: 'iPhone 15 Pro', location: 'Lagos, NG', current: true },
    { id: '2', device: 'MacBook Pro', location: 'Luanda, AO', current: false },
    { id: '3', device: 'Chrome Browser', location: 'London, UK', current: false },
];

export const PasswordSecurityScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}> 
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Password & Security</Text>
                <View style={styles.iconBtn} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Change Password</Text>
                    <TextInput
                        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                        placeholder="Current password"
                        placeholderTextColor={colors.textSecondary}
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                        placeholder="New password"
                        placeholderTextColor={colors.textSecondary}
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                        placeholder="Confirm new password"
                        placeholderTextColor={colors.textSecondary}
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={() => navigation.goBack()}>
                        <Text style={[styles.primaryBtnText, { color: colors.textInverse }]}>Update Password</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Two-Factor Authentication</Text>
                            <Text style={[styles.subText, { color: colors.textSecondary }]}>Add an extra layer of security to your account.</Text>
                        </View>
                        <Switch
                            value={twoFactorEnabled}
                            onValueChange={setTwoFactorEnabled}
                            trackColor={{ false: colors.border, true: colors.primary + '80' }}
                            thumbColor={twoFactorEnabled ? colors.primary : colors.surfaceElevated}
                        />
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Sessions</Text>
                    {ACTIVE_SESSIONS.map((session, index) => (
                        <View
                            key={session.id}
                            style={[
                                styles.sessionRow,
                                index !== ACTIVE_SESSIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                            ]}
                        >
                            <View>
                                <Text style={[styles.sessionDevice, { color: colors.text }]}>{session.device}</Text>
                                <Text style={[styles.subText, { color: colors.textSecondary }]}>{session.location}</Text>
                            </View>
                            {session.current ? (
                                <Text style={[styles.currentTag, { color: colors.primary }]}>Current</Text>
                            ) : (
                                <TouchableOpacity>
                                    <Text style={[styles.revokeText, { color: colors.destructive }]}>Revoke</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    iconBtn: { width: 32, alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '800' },
    content: { padding: 20, paddingBottom: 40, gap: 14 },
    card: { borderWidth: 1, borderRadius: 14, padding: 14 },
    sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
    input: {
        height: 46,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 14,
        marginBottom: 10,
    },
    primaryBtn: { borderRadius: 10, alignItems: 'center', paddingVertical: 12, marginTop: 4 },
    primaryBtnText: { fontSize: 14, fontWeight: '800' },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    subText: { fontSize: 12, fontWeight: '500' },
    sessionRow: { paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sessionDevice: { fontSize: 14, fontWeight: '700' },
    currentTag: { fontSize: 12, fontWeight: '800' },
    revokeText: { fontSize: 12, fontWeight: '800' },
});
