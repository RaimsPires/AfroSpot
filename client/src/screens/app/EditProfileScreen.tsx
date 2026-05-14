import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditProfileScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'EditProfile'>>();
    const { colors, isDark } = useTheme();

    // Form States (Pre-filled with mock data)
    const [name, setName] = useState('Amara Okoro');
    const [email, setEmail] = useState('amara.okoro@example.com');
    const [phone, setPhone] = useState('+1 (555) 123-4567');
    const [location, setLocation] = useState('Brooklyn, New York');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
                <View style={{ width: 40 }} /> {/* Spacer to perfectly center the title */}
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* 2. Avatar Edit Section */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: 'https://i.pravatar.cc/150?img=47' }} style={styles.avatar} />
                            {/* Overlay to indicate it's clickable */}
                            <View style={styles.avatarOverlay}>
                                <AppIcon library="Feather" name="camera" size={24} color="#FFF" />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.changePhotoBtn}>
                            <Text style={[styles.changePhotoText, { color: colors.primary }]}>Change Profile Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 3. Form Inputs */}
                    <View style={styles.formContainer}>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>FULL NAME</Text>
                            <TextInput
                                style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>EMAIL ADDRESS</Text>
                            <TextInput
                                style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="Enter your email"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PHONE NUMBER</Text>
                            <View style={[styles.iconInputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <AppIcon library="Feather" name="phone" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.iconInputField, { color: colors.text }]}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    placeholder="Enter your phone number"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>LOCATION</Text>
                            <View style={[styles.iconInputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <AppIcon library="Feather" name="map-pin" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.iconInputField, { color: colors.text }]}
                                    value={location}
                                    onChangeText={setLocation}
                                    placeholder="City, State"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>

                    </View>

                    {/* Optional: Change Password Link */}
                    <TouchableOpacity style={styles.passwordBtn}>
                        <AppIcon library="Feather" name="lock" size={18} color={colors.primary} />
                        <Text style={[styles.passwordText, { color: colors.primary }]}>Change Password</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* 4. Sticky Bottom Action */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <AppButton
                    title="Save Changes"
                    onPress={() => {
                        // Handle save logic here
                        console.log("Profile updated:", { name, email, phone, location });
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 24 },

    // Avatar Section
    avatarContainer: { alignItems: 'center', marginBottom: 32 },
    avatarWrapper: { position: 'relative', width: 110, height: 110, borderRadius: 55, overflow: 'hidden', marginBottom: 16 },
    avatar: { width: '100%', height: '100%' },
    avatarOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
    changePhotoBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.05)' },
    changePhotoText: { fontSize: 13, fontWeight: '700' },

    // Form Inputs
    formContainer: { marginBottom: 24 },
    inputGroup: { marginBottom: 20 },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },

    inputField: { height: 52, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, fontSize: 15, fontWeight: '500' },

    iconInputWrap: { flexDirection: 'row', alignItems: 'center', height: 52, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16 },
    inputIcon: { marginRight: 10 },
    iconInputField: { flex: 1, fontSize: 15, fontWeight: '500' },

    // Password Button
    passwordBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, gap: 8, alignSelf: 'flex-start' },
    passwordText: { fontSize: 15, fontWeight: '700' },

    // Footer
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1 },
});

export default EditProfileScreen;