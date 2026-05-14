import React, { useState } from 'react';
import {
    FlatList,
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

import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';


// --- Mock Data ---
const INITIAL_ADDRESSES = [
    {
        id: '1',
        type: 'Home',
        icon: 'home',
        name: 'Amara Okoro',
        address: '124 Atlantic Ave, Apt 4B',
        city: 'Brooklyn, NY 11201',
        isPrimary: true,
    },
    {
        id: '2',
        type: 'Work',
        icon: 'briefcase',
        name: 'Amara Okoro',
        address: '350 5th Ave (Empire State Bldg)',
        city: 'New York, NY 10118',
        isPrimary: false,
    },
];

const DeliveryAddressesScreen = () => {
    const { colors, isDark } = useTheme();
    const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
    const [showAddSheet, setShowAddSheet] = useState(false);

    // New Address Form State
    const [newLabel, setNewLabel] = useState('Home');
    const [newName, setNewName] = useState('');
    const [newStreet, setNewStreet] = useState('');
    const [newCity, setNewCity] = useState('');

    const addNewAddress = () => {
        if (!newName || !newStreet) return;

        const newEntry = {
            id: Date.now().toString(),
            type: newLabel,
            icon: newLabel === 'Home' ? 'home' : newLabel === 'Work' ? 'briefcase' : 'map-pin',
            name: newName,
            address: newStreet,
            city: newCity,
            isPrimary: false,
        };

        setAddresses([newEntry, ...addresses]);
        setShowAddSheet(false);
        // Reset form
        setNewName('');
        setNewStreet('');
        setNewCity('');
    };

    const renderAddressCard = ({ item }: any) => (
        <View style={[styles.addressCard, { backgroundColor: colors.surface, borderColor: item.isPrimary ? colors.primary : colors.border }]}>
            <View style={styles.cardHeader}>
                <View style={styles.labelRow}>
                    <View style={[styles.iconBg, { backgroundColor: colors.primary + '15' }]}>
                        <AppIcon library="Feather" name={item.icon} size={16} color={colors.primary} />
                    </View>
                    <Text style={[styles.labelText, { color: colors.text }]}>{item.type}</Text>
                    {item.isPrimary && (
                        <View style={[styles.primaryBadge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                        </View>
                    )}
                </View>
                <View style={styles.actionIcons}>
                    <TouchableOpacity style={styles.iconBtnSmall}>
                        <AppIcon library="Feather" name="edit-2" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                    {!item.isPrimary && (
                        <TouchableOpacity style={styles.iconBtnSmall}>
                            <AppIcon library="Feather" name="trash-2" size={16} color="#EF4444" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.cardBody}>
                <Text style={[styles.nameText, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.addressText, { color: colors.textSecondary }]}>{item.address}</Text>
                <Text style={[styles.addressText, { color: colors.textSecondary }]}>{item.city}</Text>
            </View>

            {!item.isPrimary && (
                <TouchableOpacity style={[styles.setPrimaryBtn, { borderTopColor: colors.border }]}>
                    <Text style={[styles.setPrimaryText, { color: colors.primary }]}>Set as Primary</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Delivery Addresses</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 2. Add New Button */}
                <TouchableOpacity
                    style={[styles.addBtnLarge, { borderColor: colors.primary, backgroundColor: colors.primary + '05' }]}
                    onPress={() => setShowAddSheet(true)}
                >
                    <AppIcon library="Feather" name="plus-circle" size={20} color={colors.primary} />
                    <Text style={[styles.addBtnLargeText, { color: colors.primary }]}>Add New Address</Text>
                </TouchableOpacity>

                {/* 3. List of Addresses */}
                <Text style={[styles.sectionHeader, { color: colors.text }]}>Saved Addresses</Text>
                <FlatList
                    data={addresses}
                    renderItem={renderAddressCard}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false} // Since it's inside a ScrollView
                    contentContainerStyle={styles.listContainer}
                />

            </ScrollView>

            {/* 4. Add Address Bottom Sheet */}
            <Modal
                visible={showAddSheet}
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setShowAddSheet(false)}
            >
                <Pressable style={styles.sheetOverlay} onPress={() => setShowAddSheet(false)}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                    <Pressable
                        style={[styles.sheetContainer, { backgroundColor: colors.surface }]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

                        <Text style={[styles.formTitle, { color: colors.text }]}>New Address</Text>

                        <View style={styles.typeSelector}>
                            {['Home', 'Work', 'Other'].map((l) => (
                                <TouchableOpacity
                                    key={l}
                                    onPress={() => setNewLabel(l)}
                                    style={[styles.typePill, { backgroundColor: newLabel === l ? colors.primary : colors.background, borderColor: colors.border }]}
                                >
                                    <Text style={[styles.typePillText, { color: newLabel === l ? '#FFF' : colors.textSecondary }]}>{l}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>RECEIVER NAME</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                placeholder="e.g. Amara Okoro"
                                placeholderTextColor={colors.textSecondary}
                                value={newName}
                                onChangeText={setNewName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>STREET ADDRESS</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                placeholder="e.g. 124 Atlantic Ave"
                                placeholderTextColor={colors.textSecondary}
                                value={newStreet}
                                onChangeText={setNewStreet}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>CITY, STATE, ZIP</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                placeholder="e.g. Brooklyn, NY 11201"
                                placeholderTextColor={colors.textSecondary}
                                value={newCity}
                                onChangeText={setNewCity}
                            />
                        </View>

                        <View style={styles.formActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddSheet(false)}>
                                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <AppButton title="Save Address" onPress={addNewAddress} />
                            </View>
                        </View>
                    </Pressable>
                    </KeyboardAvoidingView>
                </Pressable>
            </Modal>

        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },
    sectionHeader: { fontSize: 16, fontWeight: '800', marginTop: 30, marginBottom: 15 },

    // Add Button Large
    addBtnLarge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', gap: 10 },
    addBtnLargeText: { fontSize: 15, fontWeight: '700' },

    // Form Styles
    sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    keyboardView: { justifyContent: 'flex-end' },
    sheetContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36 },
    sheetHandle: { alignSelf: 'center', width: 48, height: 4, borderRadius: 4, marginBottom: 20 },
    formTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20 },
    typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    typePill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
    typePillText: { fontSize: 13, fontWeight: '700' },
    inputGroup: { marginBottom: 15 },
    inputLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
    input: { height: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontSize: 14 },
    formActions: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 10 },
    cancelBtn: { paddingHorizontal: 10 },
    cancelBtnText: { fontSize: 14, fontWeight: '700' },

    // Address Card
    listContainer: { gap: 16 },
    addressCard: { borderRadius: 18, borderWidth: 1, padding: 16, elevation: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconBg: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    labelText: { fontSize: 14, fontWeight: '800' },
    primaryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    primaryBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
    actionIcons: { flexDirection: 'row', gap: 10 },
    iconBtnSmall: { padding: 4 },

    cardBody: { marginBottom: 16 },
    nameText: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    addressText: { fontSize: 13, lineHeight: 18 },

    setPrimaryBtn: { borderTopWidth: 1, paddingTop: 12, alignItems: 'center' },
    setPrimaryText: { fontSize: 13, fontWeight: '700' },
});

export default DeliveryAddressesScreen;