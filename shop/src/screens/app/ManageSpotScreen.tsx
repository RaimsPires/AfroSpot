import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { SpotData, spotService } from '@services/spotService';

// Updated Edit Sections mapping to your new distinct blocks
type EditSection = 'basic' | 'category' | 'contact' | 'social' | 'location' | 'settings' | null;

// --- Reusable Layout Components ---
const SectionCard = ({ title, onEdit, children, colors }: any) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity style={[styles.editBtn, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={onEdit}>
                <AppIcon library="Feather" name="edit-2" size={14} color={colors.primary} />
                <Text style={[styles.editBtnText, { color: colors.primary }]}>Edit</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
            {children}
        </View>
    </View>
);

const ChoiceSelector = ({ label, options, selectedValue, onSelect, colors }: any) => (
    <View style={styles.choiceContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choiceScroll}>
            {options.map((opt: any) => {
                const isActive = selectedValue === opt.value;
                return (
                    <TouchableOpacity
                        key={opt.value}
                        style={[
                            styles.choicePill,
                            {
                                backgroundColor: isActive ? colors.primary : colors.background,
                                borderColor: isActive ? colors.primary : colors.border
                            }
                        ]}
                        onPress={() => onSelect(opt.value)}
                    >
                        <Text style={[styles.choiceText, { color: isActive ? '#FFF' : colors.text }]}>
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    </View>
);

// --- Dynamic Bottom Sheet Form ---
const EditSpotBottomSheet = ({
    visible, section, data, onClose, onSave, colors, isSaving
}: {
    visible: boolean, section: EditSection, data: SpotData | null, onClose: () => void, onSave: (data: Partial<SpotData>) => void, colors: any, isSaving: boolean
}) => {
    const [formData, setFormData] = useState<Partial<SpotData>>({});

    React.useEffect(() => {
        if (visible && data) setFormData(data);
    }, [visible, data]);

const handleSave = () => {
    // 🚀 Only package the exact fields related to the currently open section!
    let payload: Partial<SpotData> = {};

    switch (section) {
        case 'basic':
            payload = { 
                name: formData.name, 
                description: formData.description 
            };
            break;
        case 'category':
            payload = { 
                shop_type: formData.shop_type, 
                category: formData.category 
            };
            break;
        case 'contact':
            payload = { 
                phone_number: formData.phone_number, 
                whatsapp_number: formData.whatsapp_number, 
                email: formData.email 
            };
            break;
        case 'social':
            payload = { 
                instagram_handle: formData.instagram_handle, 
                website: formData.website 
            };
            break;
        case 'location':
            payload = { 
                address: formData.address, 
                city: formData.city, 
                country: formData.country 
            };
            break;
        case 'settings':
            payload = { 
                currency: formData.currency 
            };
            break;
    }

    // Send only the scoped payload to the backend
    onSave(payload);
    onClose();
};
    const updateField = (key: keyof SpotData, value: string) => setFormData(prev => ({ ...prev, [key]: value }));

    const renderFormContent = () => {
        switch (section) {
            case 'basic':
                // Safe check for the current description length
                const descLength = formData.description?.length || 0;
                const MAX_DESC_LENGTH = 200;

                return (
                    <>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>BUSINESS NAME</Text>
                        <TextInput 
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]} 
                            value={formData.name} 
                            onChangeText={(v) => updateField('name', v)} 
                        />
                        
                        <View style={styles.labelRow}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>DESCRIPTION</Text>
                            {/* 🚀 Visual Character Counter */}
                            <Text style={[styles.charCount, { color: descLength >= MAX_DESC_LENGTH ? colors.primary : colors.textMuted }]}>
                                {descLength}/{MAX_DESC_LENGTH}
                            </Text>
                        </View>

                        <TextInput 
                            style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.text }]} 
                            value={formData.description} 
                            onChangeText={(v) => updateField('description', v)} 
                            multiline 
                            numberOfLines={4} 
                            maxLength={MAX_DESC_LENGTH} // 🚀 Native keyboard limit enforcement
                        />
                    </>
                );
            case 'category':
                return (
                    <>
                        <ChoiceSelector
                            label="SHOP TYPE" colors={colors} selectedValue={formData.shop_type} onSelect={(v: any) => updateField('shop_type', v)}
                            options={[
                                { label: 'Individual / Freelancer', value: 'individual' },
                                { label: 'Registered Business', value: 'business' }
                            ]}
                        />
                        <ChoiceSelector
                            label="CATEGORY" colors={colors} selectedValue={formData.category} onSelect={(v: any) => updateField('category', v)}
                            options={[
                                { label: 'Restaurant & Food', value: 'restaurant' },
                                { label: 'Barbershop', value: 'barbershop' },
                                { label: 'Hair Salon', value: 'salon' },
                                { label: 'Retail Store', value: 'retail' },
                                { label: 'Other', value: 'other' }
                            ]}
                        />
                    </>
                );
            case 'contact':
                return (
                    <>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>PHONE NUMBER</Text>
                        <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} value={formData.phone_number} onChangeText={(v) => updateField('phone_number', v)} keyboardType="phone-pad" />

                        <Text style={[styles.label, { color: colors.textSecondary }]}>WHATSAPP NUMBER</Text>
                        <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} value={formData.whatsapp_number} onChangeText={(v) => updateField('whatsapp_number', v)} keyboardType="phone-pad" />

                        <Text style={[styles.label, { color: colors.textSecondary }]}>PUBLIC EMAIL</Text>
                        <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} value={formData.email} onChangeText={(v) => updateField('email', v)} keyboardType="email-address" autoCapitalize="none" />
                    </>
                );
            case 'social':
                return (
                    <>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>INSTAGRAM HANDLE</Text>
                        <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} value={formData.instagram_handle} onChangeText={(v) => updateField('instagram_handle', v)} autoCapitalize="none" placeholder="@yourshop" placeholderTextColor={colors.textSecondary} />

                        <Text style={[styles.label, { color: colors.textSecondary }]}>WEBSITE URL</Text>
                        <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} value={formData.website} onChangeText={(v) => updateField('website', v)} keyboardType="url" autoCapitalize="none" />
                    </>
                );
            case 'location':
                return (
                    <>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>STREET ADDRESS</Text>
                        <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} value={formData.address} onChangeText={(v) => updateField('address', v)} />

                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>CITY</Text>
                                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} value={formData.city} onChangeText={(v) => updateField('city', v)} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>COUNTRY</Text>
                                <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} value={formData.country} onChangeText={(v) => updateField('country', v)} />
                            </View>
                        </View>
                    </>
                );
            case 'settings':
                return (
                    <ChoiceSelector
                        label="DEFAULT CURRENCY" colors={colors} selectedValue={formData.currency} onSelect={(v: any) => updateField('currency', v)}
                        options={[
                            { label: 'USD ($)', value: 'USD' },
                            { label: 'EUR (€)', value: 'EUR' },
                            { label: 'GBP (£)', value: 'GBP' },
                            { label: 'NGN (₦)', value: 'NGN' },
                            { label: 'ZAR (R)', value: 'ZAR' }
                        ]}
                    />
                );
            default:
                return null;
        }
    };

    const getTitle = () => {
        if (section === 'basic') return 'Edit Basic Info';
        if (section === 'category') return 'Edit Categories';
        if (section === 'contact') return 'Edit Contacts';
        if (section === 'social') return 'Edit Social Accounts';
        if (section === 'location') return 'Edit Location';
        if (section === 'settings') return 'Edit Financial Settings';
        return 'Edit';
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                    <View style={[styles.bottomSheet, { backgroundColor: colors.background }]}>

                        <View style={styles.sheetHeader}>
                            <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
                            <View style={styles.sheetTitleRow}>
                                <Text style={[styles.sheetTitle, { color: colors.text }]}>{getTitle()}</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={isSaving}>
                                    <AppIcon library="Feather" name="x" size={24} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView contentContainerStyle={styles.sheetContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                            {renderFormContent()}

                            <TouchableOpacity
                                style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: isSaving ? 0.7 : 1 }]}
                                onPress={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.saveBtnText}>Save Changes</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

// --- Main Screen Layout ---
export const ManageSpotScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const [spotData, setSpotData] = useState<SpotData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<EditSection>(null);

    // Fetch initial spot data from Django backend
    useEffect(() => {
        const loadSpotData = async () => {
            try {
                const data = await spotService.getActiveSpot();
                setSpotData(data);
            } catch (error:any) {
                console.log(error.response.data);
                
                Alert.alert('Error', 'Failed to load business profile. Please check your connection.');
            } finally {
                setIsLoading(false);
            }
        };
        loadSpotData();
    }, []);
    
    const handleSaveSection = async (updatedFields: Partial<SpotData>) => {
        if (!spotData) return;
        setIsSaving(true);
        try {
            // Push changes to the backend
            const response = await spotService.updateActiveSpot(updatedFields);
            setSpotData(response); // Update local state with confirmed backend data
            setActiveSection(null); // Close the bottom sheet
        } catch (error:any) {
            console.log(error.response.data);
            Alert.alert('Save Failed', 'Could not save the updated information. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const InfoRow = ({ icon, label, value }: { icon: string, label: string, value: string | undefined }) => {
        if (!value) return null; // Gracefully hide rows where data is completely empty
        return (
            <View style={styles.infoRow}>
                <View style={styles.infoIconWrapper}>
                    <AppIcon library="Feather" name={icon} size={16} color={colors.textSecondary} />
                </View>
                <View style={styles.infoTextWrapper}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2}>{value}</Text>
                </View>
            </View>
        );
    };

    const Divider = () => <View style={[styles.divider, { backgroundColor: colors.border }]} />;

    if (isLoading || !spotData) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Profile</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 1. Basic Info Section */}
                <SectionCard title="Basic Information" onEdit={() => setActiveSection('basic')} colors={colors}>
                    <Text style={[styles.spotName, { color: colors.text }]}>{spotData.name}</Text>
                    <Text style={[styles.spotDesc, { color: colors.textSecondary }]}>{spotData.description || "No description provided."}</Text>
                </SectionCard>

                {/* 2. Categories & Type Section */}
                <SectionCard title="Business Category" onEdit={() => setActiveSection('category')} colors={colors}>
                    <View style={styles.badgeRow}>
                        <View style={[styles.badge, { backgroundColor: 'rgba(121, 82, 179, 0.1)' }]}>
                            <Text style={[styles.badgeText, { color: colors.primary }]}>{spotData.shop_type.toUpperCase()}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
                            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{spotData.category.toUpperCase()}</Text>
                        </View>
                    </View>
                </SectionCard>

                {/* 3. Contact Methods Section */}
                <SectionCard title="Contact Information" onEdit={() => setActiveSection('contact')} colors={colors}>
                    <InfoRow icon="phone" label="Primary Phone" value={spotData.phone_number} />
                    {spotData.phone_number && spotData.whatsapp_number ? <Divider /> : null}
                    <InfoRow icon="message-circle" label="WhatsApp" value={spotData.whatsapp_number} />
                    {spotData.whatsapp_number && spotData.email ? <Divider /> : null}
                    <InfoRow icon="mail" label="Email Address" value={spotData.email} />
                </SectionCard>

                {/* 4. Social Accounts Section */}
                <SectionCard title="Social Accounts" onEdit={() => setActiveSection('social')} colors={colors}>
                    <InfoRow icon="instagram" label="Instagram Profile" value={spotData.instagram_handle} />
                    {spotData.instagram_handle && spotData.website ? <Divider /> : null}
                    <InfoRow icon="globe" label="Business Website" value={spotData.website} />
                </SectionCard>

                {/* 5. Location Section */}
                <SectionCard title="Location" onEdit={() => setActiveSection('location')} colors={colors}>
                    <InfoRow icon="map-pin" label="Physical Address" value={`${spotData.address}\n${spotData.city}, ${spotData.country}`} />
                </SectionCard>

                {/* 6. Settings Section */}
                <SectionCard title="Financial Settings" onEdit={() => setActiveSection('settings')} colors={colors}>
                    <InfoRow icon="dollar-sign" label="Store Currency" value={spotData.currency} />
                </SectionCard>

            </ScrollView>

            <EditSpotBottomSheet
                visible={activeSection !== null}
                section={activeSection}
                data={spotData}
                colors={colors}
                isSaving={isSaving}
                onClose={() => setActiveSection(null)}
                onSave={handleSaveSection}
            />

        </SafeAreaView>
    );
};

// ... keep previous StyleSheet logic (add margin/padding mapping based on your layout needs)
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 4 },
    scrollContent: { padding: 16, gap: 16, paddingBottom: 40 },

    // Card Styles
    card: { borderWidth: 1, borderRadius: 16, padding: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardTitle: { fontSize: 16, fontWeight: '800' },
    editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 },
    editBtnText: { fontSize: 12, fontWeight: '700' },
    cardContent: { gap: 4 },

    // Card Internal Contents
    badgeRow: { flexDirection: 'row', gap: 8 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
    spotName: { fontSize: 20, fontWeight: '900', marginBottom: 8 },
    spotDesc: { fontSize: 14, lineHeight: 22 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    infoIconWrapper: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center' },
    infoTextWrapper: { flex: 1 },
    infoLabel: { fontSize: 11, fontWeight: '700', marginBottom: 2, textTransform: 'uppercase' },
    infoValue: { fontSize: 14, fontWeight: '600' },
    divider: { height: 1, marginVertical: 12 },

    // Bottom Sheet
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    bottomSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, maxHeight: '90%' },
    sheetHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    dragHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
    sheetTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sheetTitle: { fontSize: 20, fontWeight: '900' },
    closeBtn: { padding: 4 },
    sheetContent: { padding: 20 },

    // Form Inputs & Choice Selectors
    row: { flexDirection: 'row', gap: 12 },
    labelRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 16, 
        marginBottom: 8 
    },
    charCount: {
        fontSize: 11,
        fontWeight: '600',
    }, 
label: { 
        fontSize: 11, 
        fontWeight: '800', 
        letterSpacing: 0.5 
    },
    input: { height: 52, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    textArea: { height: 100, paddingTop: 16, textAlignVertical: 'top' },
    choiceContainer: { marginTop: 16 },
    choiceScroll: { gap: 10, paddingVertical: 4 },
    choicePill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
    choiceText: { fontSize: 13, fontWeight: '700' },
    saveBtn: { height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 32 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});