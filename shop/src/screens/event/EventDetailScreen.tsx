import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import DatePickerField from '@components/ui/DatePickerField';
import { useTheme } from '@contexts/ThemeContext';
import { EventData, eventService } from '@services/eventService';
import { launchImageLibrary } from 'react-native-image-picker';

const { width } = Dimensions.get('window');

export const EventDetailScreen = ({ route, navigation }: any) => {
    const { eventId } = route.params;
    const { colors } = useTheme();

    const [event, setEvent] = useState<EventData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Bottom Sheet States
    const [infoSheetVisible, setInfoSheetVisible] = useState(false);
    const [tiersSheetVisible, setTiersSheetVisible] = useState<'tickets' | 'vendors' | null>(null);

    // Edit States
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editStart, setEditStart] = useState(new Date());
    const [editEnd, setEditEnd] = useState(new Date());

    const [editTiers, setEditTiers] = useState<any[]>([]);

    useEffect(() => {
        fetchEventDetail();
    }, [eventId]);

    const fetchEventDetail = async () => {
        try {
            // Assume you have a getEvent endpoint in your service
            const data = await eventService.getEvent(eventId);
            setEvent(data);
        } catch (error) {
            Alert.alert("Error", "Could not load event details.");
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    };

    console.log(event);
    
    // --- Opening Sheets ---
    const openInfoSheet = () => {
        if (!event) return;
        setEditTitle(event.title);
        setEditDesc(event.description);
        setEditCategory(event.category || '');
        setEditStart(new Date(event.start_datetime));
        setEditEnd(new Date(event.end_datetime));
        setInfoSheetVisible(true);
    };

    const openTiersSheet = (type: 'tickets' | 'vendors') => {
        if (!event) return;
        if (type === 'tickets') {
            setEditTiers(event.ticket_tiers ? [...event.ticket_tiers] : []);
        } else {
            setEditTiers(event.vendor_tiers ? [...event.vendor_tiers] : []);
        }
        setTiersSheetVisible(type);
    };

    // --- Tier Manipulation ---
    const handleAddTier = () => {
        setEditTiers([...editTiers, { name: '', price: '0', capacity: '10' }]);
    };

    const handleUpdateTier = (index: number, field: string, value: string) => {
        const updated = [...editTiers];
        updated[index][field] = value;
        setEditTiers(updated);
    };

    const handleRemoveTier = (index: number) => {
        const updated = [...editTiers];
        updated.splice(index, 1);
        setEditTiers(updated);
    };

    const pickImage = async () => {
        console.log("Attempting to open image picker...");
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
                selectionLimit: 1, // Ensure only 1 image
            });

            // Check if the user didn't cancel
            if (result.didCancel) {
                console.log('User cancelled image picker');
                return;
            }

            // Check for error
            if (result.errorMessage) {
                console.error('ImagePicker Error: ', result.errorMessage);
                Alert.alert("Error", result.errorMessage);
                return;
            }

            // 🚀 Access the asset and update state
            if (result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                const formData = new FormData()

                formData.append("banner_image", {
                    uri: selectedImage.uri,
                    type: selectedImage.type || 'image/jpeg',
                    name: selectedImage.fileName || `banner_${Date.now()}.jpg`
                });

                const updatedEvent = await eventService.updateEvent(eventId, formData);
                setEvent(updatedEvent);
            }
        } catch (e) {
            console.error("Picker error:", e);
            Alert.alert("Error", "Could not open gallery.");
        }
    };

    // --- Save Actions ---
    const handleSaveInfo = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', editTitle);
            formData.append('description', editDesc);
            formData.append('category', editCategory);
            formData.append('start_datetime', editStart.toISOString());
            formData.append('end_datetime', editEnd.toISOString());

            const updatedEvent = await eventService.updateEvent(eventId, formData);
            setEvent(updatedEvent);
            setInfoSheetVisible(false);
        } catch (error) {
            Alert.alert("Error", "Failed to update event info.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveTiers = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            const validTiers = editTiers.filter(t => t.name && t.capacity);

            if (tiersSheetVisible === 'tickets') {
                formData.append('ticket_tiers', JSON.stringify(validTiers));
            } else {
                formData.append('vendor_tiers', JSON.stringify(validTiers));
            }

            const updatedEvent = await eventService.updateEvent(eventId, formData);
            setEvent(updatedEvent);
            setTiersSheetVisible(null);
        } catch (error) {
            Alert.alert("Error", "Failed to update tiers.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !event) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" translucent />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* 1. Hero Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: event.banner_image }}
                        style={styles.heroImage}
                    />
                    <SafeAreaView style={styles.headerButtons}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
                            <AppIcon library="Feather" name="chevron-left" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={pickImage}
                            style={styles.circleBtn}>
                            <AppIcon library="Feather" name="edit-3" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                <View style={styles.content}>
                    {/* Basic Info Section */}
                    <View style={styles.sectionHeader}>
                        <View style={[styles.tag, { backgroundColor: colors.primary + '60' }]}>
                            <Text style={[styles.tagText, { color: colors.primary }]}>
                                {event.category?.toUpperCase() || 'EVENT'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={openInfoSheet}
                            style={[styles.edithButtons,{ backgroundColor: colors.primary }]}
                            activeOpacity={0.7}>
                            <Text style={{ color: colors.textInverse, fontWeight: '700' }}>Edit Info</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>

                    <View style={styles.infoRow}>
                        <View style={[styles.iconBox, { backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="calendar" size={18} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={[styles.infoMain, { color: colors.text }]}>Starts: {formatDate(event.start_datetime)}</Text>
                            <Text style={[styles.infoSub, { color: colors.textSecondary }]}>Ends: {formatDate(event.end_datetime)}</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>About Event</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        {event.description}
                    </Text>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Ticket Tiers Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Ticket Tiers</Text>
                        <TouchableOpacity onPress={() => openTiersSheet('tickets')}>
                            <Text style={{ color: colors.primary, fontWeight: '700' }}>Manage Tickets</Text>
                        </TouchableOpacity>
                    </View>

                    {event.ticket_tiers?.map((tier: any, idx: number) => (
                        <View key={idx} style={[styles.tierCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View>
                                <Text style={[styles.tierName, { color: colors.text }]}>{tier.name}</Text>
                                <Text style={[styles.tierPerf, { color: colors.textSecondary }]}>
                                    Sold: {tier.quantity_sold || 0} / {tier.capacity}
                                </Text>
                            </View>
                            <Text style={[styles.tierPrice, { color: colors.primary }]}>
                                {Number(tier.price) === 0 ? 'Free' : `$${tier.price}`}
                            </Text>
                        </View>
                    ))}

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Vendor Tiers Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Vendor Stalls</Text>
                        <TouchableOpacity onPress={() => openTiersSheet('vendors')}>
                            <Text style={{ color: colors.primary, fontWeight: '700' }}>Manage Stalls</Text>
                        </TouchableOpacity>
                    </View>

                    {!event.vendor_tiers?.length && (
                        <Text style={{ color: colors.textSecondary, fontStyle: 'italic', marginBottom: 16 }}>No vendor stalls configured.</Text>
                    )}

                    {event.vendor_tiers?.map((vendor: any, idx: number) => (
                        <View key={idx} style={[styles.tierCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View>
                                <Text style={[styles.tierName, { color: colors.text }]}>{vendor.name}</Text>
                                <Text style={[styles.tierPerf, { color: colors.textSecondary }]}>
                                    Booked: {vendor.quantity_sold || 0} / {vendor.capacity}
                                </Text>
                            </View>
                            <Text style={[styles.tierPrice, { color: colors.primary }]}>${vendor.price}</Text>
                        </View>
                    ))}

                </View>
            </ScrollView>

            {/* Bottom Sheet 1: Basic Info */}
            <Modal visible={infoSheetVisible} transparent animationType="slide" onRequestClose={() => setInfoSheetVisible(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetOverlay}>
                    <Pressable style={styles.sheetBackdrop} onPress={() => setInfoSheetVisible(false)} />
                    <View style={[styles.sheetContent, { backgroundColor: colors.background }]}>
                        <View style={styles.sheetHeader}>
                            <Text style={[styles.sheetTitle, { color: colors.text }]}>Edit Event Info</Text>
                            <TouchableOpacity onPress={() => setInfoSheetVisible(false)}>
                                <AppIcon library="Feather" name="x" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            <TextInput
                                placeholder="Title" value={editTitle} onChangeText={setEditTitle}
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            />
                            <TextInput
                                placeholder="Category" value={editCategory} onChangeText={setEditCategory}
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            />
                            <View style={{ marginBottom: 12 }}><DatePickerField label="Starts At" mode="datetime" value={editStart} onChange={setEditStart} /></View>
                            <View style={{ marginBottom: 12 }}><DatePickerField label="Ends At" mode="datetime" minimumDate={editStart} value={editEnd} onChange={setEditEnd} /></View>
                            <TextInput
                                placeholder="Description" multiline value={editDesc} onChangeText={setEditDesc}
                                style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            />

                            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSaveInfo} disabled={isSaving}>
                                {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Bottom Sheet 2: Manage Tiers (Tickets or Vendors) */}
            <Modal visible={tiersSheetVisible !== null} transparent animationType="slide" onRequestClose={() => setTiersSheetVisible(null)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetOverlay}>
                    <Pressable style={styles.sheetBackdrop} onPress={() => setTiersSheetVisible(null)} />
                    <View style={[styles.sheetContent, { backgroundColor: colors.background }]}>
                        <View style={styles.sheetHeader}>
                            <Text style={[styles.sheetTitle, { color: colors.text }]}>
                                Manage {tiersSheetVisible === 'tickets' ? 'Tickets' : 'Vendors'}
                            </Text>
                            <TouchableOpacity onPress={() => setTiersSheetVisible(null)}>
                                <AppIcon library="Feather" name="x" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {editTiers.map((tier, idx) => (
                                <View key={idx} style={[styles.editTierCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text style={{ color: colors.textSecondary, fontWeight: '700', fontSize: 12 }}>TIER {idx + 1}</Text>
                                        <TouchableOpacity onPress={() => handleRemoveTier(idx)}>
                                            <AppIcon library="Feather" name="trash-2" size={16} color={colors.destructive} />
                                        </TouchableOpacity>
                                    </View>
                                    <TextInput
                                        placeholder="Tier Name" value={tier.name} onChangeText={(v) => handleUpdateTier(idx, 'name', v)}
                                        style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border, height: 40, marginBottom: 8 }]}
                                    />
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        <TextInput
                                            placeholder="Price" keyboardType="numeric" value={String(tier.price)} onChangeText={(v) => handleUpdateTier(idx, 'price', v)}
                                            style={[styles.input, { flex: 1, backgroundColor: colors.background, color: colors.text, borderColor: colors.border, height: 40 }]}
                                        />
                                        <TextInput
                                            placeholder="Capacity" keyboardType="numeric" value={String(tier.capacity)} onChangeText={(v) => handleUpdateTier(idx, 'capacity', v)}
                                            style={[styles.input, { flex: 1, backgroundColor: colors.background, color: colors.text, borderColor: colors.border, height: 40 }]}
                                        />
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity style={styles.addTierBtn} onPress={handleAddTier}>
                                <AppIcon library="Feather" name="plus-circle" size={16} color={colors.primary} />
                                <Text style={{ color: colors.primary, fontWeight: '700', marginLeft: 6 }}>Add New Tier</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary, marginTop: 24 }]} onPress={handleSaveTiers} disabled={isSaving}>
                                {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Save Configuration</Text>}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    imageContainer: { width: width, height: 300, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    headerButtons: { position: 'absolute', top: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
    circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
    content: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },

    edithButtons: {
        padding:6,
        borderRadius:8,
    },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    tagText: { fontSize: 11, fontWeight: '800' },
    title: { fontSize: 24, fontWeight: '900', marginBottom: 20 },

    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
    iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    infoMain: { fontSize: 15, fontWeight: '700' },
    infoSub: { fontSize: 13, marginTop: 2 },

    divider: { height: 1, marginVertical: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
    description: { fontSize: 15, lineHeight: 24 },

    tierCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
    tierName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    tierPerf: { fontSize: 12, fontWeight: '600' },
    tierPrice: { fontSize: 18, fontWeight: '900' },

    // Bottom Sheets
    sheetOverlay: { flex: 1, justifyContent: 'flex-end' },
    sheetBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.5)' },
    sheetContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
    sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    sheetTitle: { fontSize: 18, fontWeight: '800' },

    input: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, marginBottom: 12 },
    textArea: { height: 100, borderRadius: 12, borderWidth: 1, padding: 16, textAlignVertical: 'top', marginBottom: 20 },

    editTierCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
    addTierBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, alignSelf: 'flex-start' },

    saveBtn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});