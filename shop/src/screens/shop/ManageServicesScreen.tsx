import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

// --- Mock Data ---
const INITIAL_SERVICES = [
    {
        id: '1',
        title: 'Fresh Fade & Lineup',
        description: 'Detailed fade with signature line-up and hot towel finish.',
        price: '35.00',
        duration: '45 mins',
    },
    {
        id: '2',
        title: 'Beard Grooming & Shape',
        description: 'Precision trimming, shaping, and organic beard oil treatment.',
        price: '25.00',
        duration: '30 mins',
    },
    {
        id: '3',
        title: 'Full Grooming Experience',
        description: 'The ultimate package: Haircut, beard, facial, and scalp massage.',
        price: '65.00',
        duration: '75 mins',
    },
];

const ManageServicesScreen = () => {
    const { colors, isDark } = useTheme();

    const [services, setServices] = useState(INITIAL_SERVICES);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');

    const openAddModal = () => {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setPrice('');
        setDuration('');
        setModalVisible(true);
    };

    const openEditModal = (service: any) => {
        setEditingId(service.id);
        setTitle(service.title);
        setDescription(service.description);
        setPrice(service.price);
        setDuration(service.duration);
        setModalVisible(true);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Service',
            'Are you sure you want to delete this service?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setServices(services.filter(s => s.id !== id))
                },
            ]
        );
    };

    const handleSave = () => {
        if (!title || !price || !duration) {
            Alert.alert('Missing Fields', 'Please fill out the title, price, and duration.');
            return;
        }

        if (editingId) {
            // Edit existing
            setServices(services.map(s =>
                s.id === editingId ? { id: editingId, title, description, price, duration } : s
            ));
        } else {
            // Add new
            const newService = {
                id: Date.now().toString(),
                title,
                description,
                price,
                duration,
            };
            setServices([...services, newService]);
        }
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Services</Text>
                <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
                    <AppIcon library="Feather" name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Services List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {services.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconBg, { backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="scissors" size={32} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Services Yet</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Add the services you offer to allow customers to book appointments.</Text>
                        <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: colors.primary }]} onPress={openAddModal}>
                            <Text style={styles.emptyBtnText}>Add First Service</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    services.map((service) => (
                        <View key={service.id} style={[styles.serviceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={styles.cardHeader}>
                                <Text style={[styles.serviceTitle, { color: colors.text }]} numberOfLines={1}>{service.title}</Text>
                                <Text style={[styles.servicePrice, { color: colors.primary }]}>${service.price}</Text>
                            </View>

                            <Text style={[styles.serviceDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                                {service.description}
                            </Text>

                            <View style={styles.cardFooter}>
                                <View style={styles.durationRow}>
                                    <AppIcon library="Feather" name="clock" size={14} color={colors.textSecondary} />
                                    <Text style={[styles.durationText, { color: colors.textSecondary }]}>{service.duration}</Text>
                                </View>

                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(service)}>
                                        <AppIcon library="Feather" name="edit-2" size={16} color={colors.textSecondary} />
                                        <Text style={[styles.actionText, { color: colors.textSecondary }]}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(service.id)}>
                                        <AppIcon library="Feather" name="trash-2" size={16} color="#EF4444" />
                                        <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Add / Edit Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.background, borderTopColor: colors.border }]}>

                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {editingId ? 'Edit Service' : 'Add New Service'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                                <AppIcon library="Feather" name="x" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>SERVICE NAME</Text>
                                <TextInput
                                    style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="e.g. Haircut & Wash"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>

                            <View style={styles.rowInputs}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRICE ($)</Text>
                                    <TextInput
                                        style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                        value={price}
                                        onChangeText={setPrice}
                                        placeholder="0.00"
                                        keyboardType="decimal-pad"
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DURATION</Text>
                                    <TextInput
                                        style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                        value={duration}
                                        onChangeText={setDuration}
                                        placeholder="e.g. 30 mins"
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DESCRIPTION (OPTIONAL)</Text>
                                <TextInput
                                    style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Details about this service..."
                                    placeholderTextColor={colors.textSecondary}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>

                        </ScrollView>

                        <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                            <TouchableOpacity
                                style={[styles.cancelBtn, { borderColor: colors.border }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveActionBtn, { backgroundColor: colors.primary }]}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveActionBtnText}>Save Service</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </KeyboardAvoidingView>
            </Modal>

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
    addBtn: { padding: 8 },

    // List
    listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },

    serviceCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    serviceTitle: { fontSize: 16, fontWeight: '800', flex: 1, paddingRight: 8 },
    servicePrice: { fontSize: 18, fontWeight: '900' },
    serviceDesc: { fontSize: 14, lineHeight: 20, marginBottom: 16 },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    durationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    durationText: { fontSize: 13, fontWeight: '600' },
    actionRow: { flexDirection: 'row', gap: 16 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    actionText: { fontSize: 13, fontWeight: '700' },

    // Empty State
    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 20 },
    emptyIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    emptyBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 },
    emptyBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    closeBtn: { padding: 4 },
    modalScroll: { paddingHorizontal: 20, paddingBottom: 20 },

    // Inputs
    inputGroup: { marginBottom: 20 },
    rowInputs: { flexDirection: 'row' },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
    inputField: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    textArea: { height: 100, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15 },

    // Modal Footer
    modalFooter: { flexDirection: 'row', padding: 20, paddingBottom: 34, borderTopWidth: 1, gap: 12 },
    cancelBtn: { flex: 1, height: 52, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    cancelBtnText: { fontSize: 15, fontWeight: '700' },
    saveActionBtn: { flex: 1.5, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    saveActionBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});

export default ManageServicesScreen;