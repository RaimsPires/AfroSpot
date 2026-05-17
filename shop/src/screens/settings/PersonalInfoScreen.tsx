import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

export const PersonalInfoScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const [fullName, setFullName] = useState('AfroSpot Shop');
    const [email, setEmail] = useState('business@afrospot.com');
    const [phone, setPhone] = useState('+1 555 210 9876');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}> 
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Personal Information</Text>
                <View style={styles.iconBtn} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                    <TextInput value={fullName} onChangeText={setFullName} style={[styles.input, { color: colors.text, borderColor: colors.border }]} />

                    <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
                    <TextInput value={email} onChangeText={setEmail} style={[styles.input, { color: colors.text, borderColor: colors.border }]} keyboardType="email-address" autoCapitalize="none" />

                    <Text style={[styles.label, { color: colors.textSecondary }]}>Phone</Text>
                    <TextInput value={phone} onChangeText={setPhone} style={[styles.input, { color: colors.text, borderColor: colors.border }]} keyboardType="phone-pad" />
                </View>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}> 
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={() => navigation.goBack()}>
                    <Text style={[styles.saveBtnText, { color: colors.textInverse }]}>Save Changes</Text>
                </TouchableOpacity>
            </View>
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
    content: { padding: 20, paddingBottom: 120 },
    card: { borderWidth: 1, borderRadius: 14, padding: 16 },
    label: { fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 8 },
    input: {
        height: 46,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 14,
        fontWeight: '500',
    },
    footer: { borderTopWidth: 1, paddingHorizontal: 20, paddingVertical: 14 },
    saveBtn: { borderRadius: 12, alignItems: 'center', paddingVertical: 14 },
    saveBtnText: { fontSize: 14, fontWeight: '800' },
});
