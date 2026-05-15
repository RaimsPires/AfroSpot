import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

// --- Mock Data ---
const INITIAL_PHOTOS = [
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=200',
    'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=200',
];

const CATEGORIES = ['Barbershop', 'Hair Salon', 'Restaurant', 'Fashion', 'Grocery'];

const INITIAL_HOURS = [
    { day: 'Monday', isOpen: true, open: '09:00 AM', close: '08:00 PM' },
    { day: 'Tuesday', isOpen: true, open: '09:00 AM', close: '08:00 PM' },
    { day: 'Wednesday', isOpen: true, open: '09:00 AM', close: '08:00 PM' },
    { day: 'Thursday', isOpen: true, open: '09:00 AM', close: '08:00 PM' },
    { day: 'Friday', isOpen: true, open: '09:00 AM', close: '09:00 PM' },
    { day: 'Saturday', isOpen: true, open: '10:00 AM', close: '06:00 PM' },
    { day: 'Sunday', isOpen: false, open: 'Closed', close: 'Closed' },
];

const ManageProfileScreen = () => {
    const { colors, isDark } = useTheme();

    // Form States
    const [photos, setPhotos] = useState(INITIAL_PHOTOS);
    const [businessName, setBusinessName] = useState('Kushite Cutz & Styles');
    const [description, setDescription] = useState("Founded by Kofi Mensah in 2018, Kushite Cutz is a sanctuary for Afro-grooming excellence.");
    const [phone, setPhone] = useState('+1 (555) 987-6543');
    const [address, setAddress] = useState('124 Harlem Ave, New York, NY 10027');
    const [selectedCategory, setSelectedCategory] = useState('Barbershop');
    const [hours, setHours] = useState(INITIAL_HOURS);

    const toggleDayOpen = (index: number) => {
        const newHours = [...hours];
        newHours[index].isOpen = !newHours[index].isOpen;
        if (!newHours[index].isOpen) {
            newHours[index].open = 'Closed';
            newHours[index].close = 'Closed';
        } else {
            newHours[index].open = '09:00 AM';
            newHours[index].close = '05:00 PM';
        }
        setHours(newHours);
    };

    const removePhoto = (indexToRemove: number) => {
        setPhotos(photos.filter((_, index) => index !== indexToRemove));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Profile</Text>
                <TouchableOpacity style={styles.saveBtn}>
                    <Text style={[styles.saveBtnText, { color: colors.primary }]}>Save</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* 2. Upload Photos Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Business Photos</Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Add up to 12 photos of your storefront, interior, or work.</Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosScroll}>
                            <TouchableOpacity style={[styles.addPhotoBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <AppIcon library="Feather" name="camera" size={24} color={colors.textSecondary} />
                                <Text style={[styles.addPhotoText, { color: colors.textSecondary }]}>Add Photo</Text>
                            </TouchableOpacity>

                            {photos.map((photo, index) => (
                                <View key={index} style={styles.photoWrapper}>
                                    <Image source={{ uri: photo }} style={styles.photoThumbnail} />
                                    <TouchableOpacity
                                        style={[styles.deletePhotoBtn, { backgroundColor: colors.destructive, borderColor: colors.surfaceElevated }]}
                                        onPress={() => removePhoto(index)}
                                    >
                                        <AppIcon library="Feather" name="x" size={14} color={colors.textInverse} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* 3. Business Info Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>General Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>BUSINESS NAME</Text>
                            <TextInput
                                style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                value={businessName}
                                onChangeText={setBusinessName}
                                placeholder="Enter business name"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DESCRIPTION</Text>
                            <TextInput
                                style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Tell customers about your business..."
                                placeholderTextColor={colors.textSecondary}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PHONE NUMBER</Text>
                            <TextInput
                                style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="+1 (000) 000-0000"
                                keyboardType="phone-pad"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>LOCATION ADDRESS</Text>
                            <View style={[styles.iconInputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <TextInput
                                    style={[styles.iconInputField, { color: colors.text }]}
                                    value={address}
                                    onChangeText={setAddress}
                                    placeholder="Street address, City, State"
                                    placeholderTextColor={colors.textSecondary}
                                />
                                <TouchableOpacity style={styles.mapPinBtn}>
                                    <AppIcon library="Feather" name="map-pin" size={18} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* 4. Categories Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Category</Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Select the primary category for your business.</Text>

                        <View style={styles.categoriesWrapper}>
                            {CATEGORIES.map((cat) => {
                                const isActive = selectedCategory === cat;
                                return (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => setSelectedCategory(cat)}
                                        style={[
                                            styles.categoryPill,
                                            {
                                                backgroundColor: isActive ? colors.primary : colors.surface,
                                                borderColor: isActive ? colors.primary : colors.border,
                                            }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.categoryPillText,
                                            { color: isActive ? colors.textInverse : colors.text }
                                        ]}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* 5. Opening Hours Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Opening Hours</Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Set your weekly availability.</Text>

                        <View style={[styles.hoursContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            {hours.map((item, index) => (
                                <View key={item.day} style={[styles.hourRow, index !== hours.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>

                                    <View style={styles.hourLeft}>
                                        <Switch
                                            value={item.isOpen}
                                            onValueChange={() => toggleDayOpen(index)}
                                            trackColor={{ false: colors.border, true: colors.primary + '80' }}
                                            thumbColor={item.isOpen ? colors.primary : colors.surfaceElevated}
                                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                        />
                                        <Text style={[styles.dayText, { color: colors.text }]}>{item.day}</Text>
                                    </View>

                                    {item.isOpen ? (
                                        <View style={styles.timeSelectRow}>
                                            <TouchableOpacity style={[styles.timeBox, { borderColor: colors.border }]}>
                                                <Text style={[styles.timeText, { color: colors.text }]}>{item.open}</Text>
                                            </TouchableOpacity>
                                            <Text style={{ color: colors.textSecondary, marginHorizontal: 4 }}>-</Text>
                                            <TouchableOpacity style={[styles.timeBox, { borderColor: colors.border }]}>
                                                <Text style={[styles.timeText, { color: colors.text }]}>{item.close}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <Text style={[styles.closedText, { color: colors.textSecondary }]}>Closed</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },
    saveBtn: { paddingHorizontal: 12, paddingVertical: 8 },
    saveBtnText: { fontSize: 16, fontWeight: '800' },

    scrollContent: { paddingBottom: 40 },
    section: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
    sectionSubtitle: { fontSize: 13, marginBottom: 16, lineHeight: 20 },
    divider: { height: 1, width: '100%', marginVertical: 8 },

    // Photos
    photosScroll: { gap: 12, paddingRight: 20 },
    addPhotoBtn: { width: 100, height: 100, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
    addPhotoText: { fontSize: 12, fontWeight: '600', marginTop: 8 },
    photoWrapper: { position: 'relative', width: 100, height: 100 },
    photoThumbnail: { width: '100%', height: '100%', borderRadius: 12 },
    deletePhotoBtn: { position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },

    // Inputs
    inputGroup: { marginBottom: 20 },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
    inputField: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    textArea: { height: 100, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15 },

    iconInputWrap: { flexDirection: 'row', alignItems: 'center', height: 50, borderWidth: 1, borderRadius: 12, paddingLeft: 16, paddingRight: 8 },
    iconInputField: { flex: 1, fontSize: 15 },
    mapPinBtn: { padding: 8 },

    // Categories
    categoriesWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    categoryPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
    categoryPillText: { fontSize: 14, fontWeight: '600' },

    // Hours
    hoursContainer: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    hourRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
    hourLeft: { flexDirection: 'row', alignItems: 'center', width: 120 },
    dayText: { fontSize: 14, fontWeight: '600', marginLeft: 8 },
    timeSelectRow: { flexDirection: 'row', alignItems: 'center' },
    timeBox: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    timeText: { fontSize: 13, fontWeight: '600' },
    closedText: { fontSize: 14, fontWeight: '600', fontStyle: 'italic', marginRight: 16 },
});

export default ManageProfileScreen;