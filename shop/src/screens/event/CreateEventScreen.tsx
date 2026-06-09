import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🚀 Use your specific libraries
import { Asset, launchImageLibrary } from 'react-native-image-picker';

import { AppIcon, DatePickerField } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { eventService, TicketTierInput, VendorTierInput } from '@services/eventService';

const PRESET_CATEGORIES = ['Festival', 'Pop-up', 'Workshop', 'Music', 'Networking'];

export const CreateEventScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const [isSaving, setIsSaving] = useState(false);

    // 1. Base Event State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    
    // 🚀 Image Picker State
    const [bannerImage, setBannerImage] = useState<Asset | null>(null);

    // 🚀 Date State
    const [startDatetime, setStartDatetime] = useState<Date>(new Date());
    const [endDatetime, setEndDatetime] = useState<Date>(new Date(Date.now() + 86400000));

    // 2. Ticket State
    const [isPaidEvent, setIsPaidEvent] = useState(false);
    const [ticketTiers, setTicketTiers] = useState<TicketTierInput[]>([{ name: 'General Admission', price: '', capacity: '' }]);

    // 3. Vendor State
    const [hasVendorSpots, setHasVendorSpots] = useState(false);
    const [vendorTiers, setVendorTiers] = useState<VendorTierInput[]>([{ name: 'Standard Booth', price: '', capacity: '' }]);

    // --- 📸 react-native-image-picker Handler ---
    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: 1,
        });

        if (!result.didCancel && result.assets && result.assets.length > 0) {
            setBannerImage(result.assets[0]);
        }
    };

    // --- Array Manipulation Helpers ---
    const addTicketTier = () => setTicketTiers([...ticketTiers, { name: '', price: '', capacity: '' }]);
    const updateTicketTier = (index: number, field: keyof TicketTierInput, value: string) => {
        const newTiers = [...ticketTiers];
        newTiers[index][field] = value;
        setTicketTiers(newTiers);
    };

    const addVendorTier = () => setVendorTiers([...vendorTiers, { name: '', price: '', capacity: '' }]);
    const updateVendorTier = (index: number, field: keyof VendorTierInput, value: string) => {
        const newTiers = [...vendorTiers];
        newTiers[index][field] = value;
        setVendorTiers(newTiers);
    };

    // --- Save Logic ---
    const handlePublish = async () => {
        if (!title || !description || !category) {
            Alert.alert("Missing Fields", "Please fill out the title, category, and description.");
            return;
        }
        if (endDatetime <= startDatetime) {
            Alert.alert("Invalid Dates", "The event must end after it starts!");
            return;
        }

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            
            // Format dates for Django (ISO 8601)
            formData.append('start_datetime', startDatetime.toISOString());
            formData.append('end_datetime', endDatetime.toISOString());
            
            // 🚀 Append react-native-image-picker Asset correctly
            if (bannerImage && bannerImage.uri) {
                formData.append('banner_image', {
                    uri: bannerImage.uri,
                    type: bannerImage.type || 'image/jpeg',
                    name: bannerImage.fileName || `banner_${Date.now()}.jpg`
                } as any);
            }

            // Package Tickets & Vendors
            if (isPaidEvent) {
                const validTickets = ticketTiers.filter(t => t.name && t.capacity);
                formData.append('ticket_tiers', JSON.stringify(validTickets));
            } else {
                formData.append('ticket_tiers', JSON.stringify([{ name: 'RSVP (Free)', price: 0, capacity: 500 }]));
            }

            if (hasVendorSpots) {
                const validVendors = vendorTiers.filter(v => v.name && v.capacity);
                formData.append('vendor_tiers', JSON.stringify(validVendors));
            }

            await eventService.createEvent(formData);
            
            Alert.alert("Success", "Event Published Successfully!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not publish event. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={isSaving}>
                    <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Create Event</Text>
                <TouchableOpacity onPress={handlePublish} disabled={isSaving}>
                    {isSaving ? (
                        <ActivityIndicator color={colors.primary} />
                    ) : (
                        <Text style={[styles.saveText, { color: colors.primary }]}>Publish</Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Section: Banner Image */}
                    <TouchableOpacity 
                        style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={pickImage}
                    >
                        {bannerImage ? (
                            <Image source={{ uri: bannerImage.uri }} style={styles.bannerPreview} />
                        ) : (
                            <>
                                <AppIcon library="Feather" name="image" size={32} color={colors.textSecondary} />
                                <Text style={[styles.uploadText, { color: colors.textSecondary }]}>Upload Event Poster</Text>
                            </>
                        )}
                        {bannerImage && (
                            <View style={[styles.editIconOverlay, { backgroundColor: colors.primary }]}>
                                <AppIcon library="Feather" name="edit-2" size={14} color="#FFF" />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Section: Basic Details */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Details</Text>
                        <TextInput
                            placeholder="Event Title"
                            placeholderTextColor={colors.textSecondary}
                            value={title}
                            onChangeText={setTitle}
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        />
                        
                        <Text style={[styles.subLabel, { color: colors.textSecondary }]}>Select or type a Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                            {PRESET_CATEGORIES.map(cat => (
                                <TouchableOpacity 
                                    key={cat} 
                                    onPress={() => setCategory(cat)}
                                    style={[styles.catPill, category === cat ? { backgroundColor: colors.primary, borderColor: colors.primary } : { backgroundColor: colors.surface, borderColor: colors.border }]}
                                >
                                    <Text style={{ color: category === cat ? '#FFF' : colors.text }}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TextInput
                            placeholder="Or type custom category..."
                            placeholderTextColor={colors.textSecondary}
                            value={category}
                            onChangeText={setCategory}
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        />

                        {/* 🚀 Cleaned up Date Pickers using your Component */}
                        <View style={{ marginBottom: 16 }}>
                            <DatePickerField 
                                label="Starts At"
                                // mode="datetime"
                                value={startDatetime}
                                onChange={(date) => setStartDatetime(date)}
                            />
                        </View>
                        <View style={{ marginBottom: 16 }}>
                            <DatePickerField 
                                label="Ends At"
                                // mode="datetime"
                                minimumDate={startDatetime} // Prevents picking an end date before the start date
                                value={endDatetime}
                                onChange={(date) => setEndDatetime(date)}
                            />
                        </View>

                        <TextInput
                            placeholder="Description"
                            placeholderTextColor={colors.textSecondary}
                            multiline
                            value={description}
                            onChangeText={setDescription}
                            style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                        />
                    </View>

                    {/* Section: Tickets */}
                    <View style={styles.section}>
                        <View style={styles.rowBetween}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ticketing</Text>
                            <View style={styles.row}>
                                <Text style={{ color: colors.textSecondary, marginRight: 8 }}>{isPaidEvent ? 'Paid Tickets' : 'Free RSVP'}</Text>
                                <Switch value={isPaidEvent} onValueChange={setIsPaidEvent} />
                            </View>
                        </View>

                        {isPaidEvent && ticketTiers.map((tier, index) => (
                            <View key={index} style={[styles.variantCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <TextInput 
                                    placeholder="Tier Name (e.g. VIP, Early Bird)" 
                                    placeholderTextColor={colors.textSecondary}
                                    value={tier.name}
                                    onChangeText={(val) => updateTicketTier(index, 'name', val)}
                                    style={[styles.input, { borderColor: colors.border, color: colors.text, height: 44, marginBottom: 8 }]} 
                                />
                                <View style={styles.row}>
                                    <TextInput placeholder="Price ($)" placeholderTextColor={colors.textSecondary} value={tier.price} onChangeText={(val) => updateTicketTier(index, 'price', val)} style={[styles.smallInput, { borderColor: colors.border, color: colors.text }]} keyboardType="numeric" />
                                    <TextInput placeholder="Capacity (Qty)" placeholderTextColor={colors.textSecondary} value={tier.capacity} onChangeText={(val) => updateTicketTier(index, 'capacity', val)} style={[styles.smallInput, { borderColor: colors.border, color: colors.text }]} keyboardType="numeric" />
                                </View>
                            </View>
                        ))}
                        {isPaidEvent && (
                            <TouchableOpacity style={styles.addVariantBtn} onPress={addTicketTier}>
                                <AppIcon library="Feather" name="plus-circle" size={16} color={colors.primary} />
                                <Text style={{ color: colors.primary, fontWeight: '700', marginLeft: 6 }}>Add Ticket Tier</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Section: Vendor Stalls */}
                    <View style={styles.section}>
                        <View style={styles.rowBetween}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Vendor Applications</Text>
                            <Switch value={hasVendorSpots} onValueChange={setHasVendorSpots} />
                        </View>

                        {hasVendorSpots && vendorTiers.map((vendor, index) => (
                            <View key={index} style={[styles.variantCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <TextInput 
                                    placeholder="Stall Type (e.g. Food Truck, Art Table)" 
                                    placeholderTextColor={colors.textSecondary}
                                    value={vendor.name}
                                    onChangeText={(val) => updateVendorTier(index, 'name', val)}
                                    style={[styles.input, { borderColor: colors.border, color: colors.text, height: 44, marginBottom: 8 }]} 
                                />
                                <View style={styles.row}>
                                    <TextInput placeholder="Stall Fee ($)" placeholderTextColor={colors.textSecondary} value={vendor.price} onChangeText={(val) => updateVendorTier(index, 'price', val)} style={[styles.smallInput, { borderColor: colors.border, color: colors.text }]} keyboardType="numeric" />
                                    <TextInput placeholder="Total Spots" placeholderTextColor={colors.textSecondary} value={vendor.capacity} onChangeText={(val) => updateVendorTier(index, 'capacity', val)} style={[styles.smallInput, { borderColor: colors.border, color: colors.text }]} keyboardType="numeric" />
                                </View>
                            </View>
                        ))}
                        {hasVendorSpots && (
                            <TouchableOpacity style={styles.addVariantBtn} onPress={addVendorTier}>
                                <AppIcon library="Feather" name="plus-circle" size={16} color={colors.primary} />
                                <Text style={{ color: colors.primary, fontWeight: '700', marginLeft: 6 }}>Add Vendor Type</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    saveText: { fontWeight: '800', fontSize: 16 },
    scrollContent: { padding: 20 },
    
    uploadBox: { height: 200, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 24, overflow: 'hidden' },
    uploadText: { marginTop: 8, fontWeight: '600' },
    bannerPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
    editIconOverlay: { position: 'absolute', bottom: 12, right: 12, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    
    section: { marginBottom: 32 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
    subLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8, marginTop: 4 },
    
    input: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, marginBottom: 12 },
    textArea: { height: 100, borderRadius: 12, borderWidth: 1, padding: 16, textAlignVertical: 'top', marginTop: 12 },
    
    catPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
    
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    row: { flexDirection: 'row', alignItems: 'center' },
    
    variantCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
    smallInput: { flex: 1, height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginHorizontal: 4 },
    addVariantBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 4, paddingVertical: 8 },
});