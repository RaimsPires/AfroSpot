import React, { useMemo, useState } from 'react';
import {
    Alert,
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

import { AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTheme } from '@contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '@navigation/types';
import { useAuthStore } from '@store/authStore';
import { UserAddress } from '@type/auth';
import { SafeAreaView } from 'react-native-safe-area-context';


const LABEL_TO_ADDRESS_TYPE = {
    Home: 'home',
    Work: 'work',
    Other: 'other',
} as const;

function getAddressTypeLabel(type: UserAddress['address_type']): 'Home' | 'Work' | 'Other' {
    if (type === 'home') {
        return 'Home';
    }

    if (type === 'work') {
        return 'Work';
    }

    return 'Other';
}

function getAddressIcon(type: UserAddress['address_type']) {
    if (type === 'home') {
        return 'home';
    }

    if (type === 'work') {
        return 'briefcase';
    }

    return 'map-pin';
}

const DeliveryAddressesScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'DeliveryAddresses'>>();
    const { colors, isDark } = useTheme();
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const addAddress = useAuthStore((state) => state.addAddress);
    const updateAddress = useAuthStore((state) => state.updateAddress);
    const setPrimaryAddress = useAuthStore((state) => state.setPrimaryAddress);

    const addresses = useMemo(() => {
        return [...(user?.addresses ?? [])].sort((a, b) => {
            if (a.is_active === b.is_active) {
                return 0;
            }

            return a.is_active ? -1 : 1;
        });
    }, [user?.addresses]);

    const [showAddressSheet, setShowAddressSheet] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSettingPrimary, setIsSettingPrimary] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // New Address Form State
    const [newLabel, setNewLabel] = useState<keyof typeof LABEL_TO_ADDRESS_TYPE>('Home');
    const [newName, setNewName] = useState('');
    const [newStreet, setNewStreet] = useState('');
    const [newCity, setNewCity] = useState('');
    const [newState, setNewState] = useState('');
    const [newZipCode, setNewZipCode] = useState('');
    const [newCountry, setNewCountry] = useState('');
    const [newIsPrimary, setNewIsPrimary] = useState(false);

    const displayName = useMemo(() => {
        if (!user) {
            return 'Account User';
        }

        const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
        return fullName || user.email;
    }, [user]);

    const selectedAddress = useMemo(() => {
        if (!selectedAddressId) {
            return null;
        }

        return addresses.find((address) => address.id === selectedAddressId) ?? null;
    }, [addresses, selectedAddressId]);

    const editingAddress = useMemo(() => {
        if (!editingAddressId) {
            return null;
        }

        return addresses.find((address) => address.id === editingAddressId) ?? null;
    }, [addresses, editingAddressId]);

    const isEditingAddress = Boolean(editingAddress);

    const resetForm = () => {
        setNewLabel('Home');
        setNewName('');
        setNewStreet('');
        setNewCity('');
        setNewState('');
        setNewZipCode('');
        setNewCountry('');
        setNewIsPrimary(false);
    };

    const populateForm = (address: UserAddress) => {
        setNewLabel(getAddressTypeLabel(address.address_type));
        setNewName(displayName);
        setNewStreet(address.address);
        setNewCity(address.city);
        setNewState(address.state);
        setNewZipCode(address.zip_code);
        setNewCountry(address.country);
        setNewIsPrimary(address.is_active);
    };

    const closeAddressSheet = () => {
        setShowAddressSheet(false);
        setEditingAddressId(null);
        resetForm();
    };

    const openAddAddressSheet = () => {
        setErrorMessage(null);
        setEditingAddressId(null);
        resetForm();
        setShowAddressSheet(true);
    };

    const openEditAddressSheet = (address: UserAddress) => {
        setErrorMessage(null);
        setSelectedAddressId(null);
        setEditingAddressId(address.id);
        populateForm(address);
        setShowAddressSheet(true);
    };

    const submitAddress = async () => {
        if (!newStreet.trim() || !newCity.trim() || !newState.trim() || !newZipCode.trim() || !newCountry.trim()) {
            setErrorMessage('Please fill in all required address fields.');
            return;
        }

        try {
            setErrorMessage(null);
            setIsSubmitting(true);
            const payload = {
                address_type: LABEL_TO_ADDRESS_TYPE[newLabel],
                is_active: newIsPrimary,
                address: newStreet.trim(),
                city: newCity.trim(),
                state: newState.trim(),
                zip_code: newZipCode.trim(),
                country: newCountry.trim(),
            };

            if (editingAddressId) {
                await updateAddress(editingAddressId, payload);
            } else {
                await addAddress(payload);
            }

            closeAddressSheet();
        } catch {
            setErrorMessage(editingAddressId
                ? 'Unable to update address right now. Please try again.'
                : 'Unable to save address right now. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSetPrimary = async (addressId: string) => {
        try {
            setErrorMessage(null);
            setIsSettingPrimary(addressId);
            await setPrimaryAddress(addressId);
        } catch {
            Alert.alert('Update failed', 'Could not set this address as primary. Please try again.');
        } finally {
            setIsSettingPrimary(null);
        }
    };

    const renderAddressCard = ({ item }: { item: UserAddress }) => (
        <View style={[styles.addressCard, { backgroundColor: colors.surface, borderColor: item.is_active ? colors.primary : colors.border }]}>
            <View style={styles.cardHeader}>
                <View style={styles.labelRow}>
                    <View style={[styles.iconBg, { backgroundColor: colors.primary + '15' }]}>
                        <AppIcon library="Feather" name={getAddressIcon(item.address_type)} size={16} color={colors.primary} />
                    </View>
                    <Text style={[styles.labelText, { color: colors.text }]}>{getAddressTypeLabel(item.address_type)}</Text>
                    {item.is_active && (
                        <View style={[styles.primaryBadge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                        </View>
                    )}
                </View>
                <View style={styles.actionIcons}>
                    <TouchableOpacity style={styles.iconBtnSmall} onPress={() => openEditAddressSheet(item)}>
                        <AppIcon library="Feather" name="edit-2" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                    {!item.is_active && (
                        <TouchableOpacity style={styles.iconBtnSmall} disabled>
                            <AppIcon library="Feather" name="trash-2" size={16} color="#EF4444" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <TouchableOpacity
                style={styles.cardBody}
                onPress={() => setSelectedAddressId(item.id)}
                activeOpacity={0.8}
            >
                <Text style={[styles.nameText, { color: colors.text }]}>{displayName}</Text>
                <Text style={[styles.addressText, { color: colors.textSecondary }]}>{item.address}</Text>
                <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                    {`${item.city}, ${item.state} ${item.zip_code}`}
                </Text>
                <Text style={[styles.addressText, { color: colors.textSecondary }]}>{item.country}</Text>
            </TouchableOpacity>

            {!item.is_active && (
                <TouchableOpacity
                    style={[styles.setPrimaryBtn, { borderTopColor: colors.border }]}
                    onPress={() => handleSetPrimary(item.id)}
                    disabled={isSettingPrimary === item.id}
                >
                    <Text style={[styles.setPrimaryText, { color: colors.primary }]}>
                        {isSettingPrimary === item.id ? 'Updating...' : 'Set as Primary'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Delivery Addresses</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 2. Add New Button */}
                <TouchableOpacity
                    style={[styles.addBtnLarge, { borderColor: colors.primary, backgroundColor: colors.primary + '05' }]}
                    onPress={openAddAddressSheet}
                >
                    <AppIcon library="Feather" name="plus-circle" size={20} color={colors.primary} />
                    <Text style={[styles.addBtnLargeText, { color: colors.primary }]}>Add New Address</Text>
                </TouchableOpacity>

                {/* 3. List of Addresses */}
                <Text style={[styles.sectionHeader, { color: colors.text }]}>Saved Addresses</Text>
                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                {loading && addresses.length === 0 ? (
                    <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>Loading your addresses...</Text>
                ) : null}

                {!loading && addresses.length === 0 ? (
                    <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No saved address yet. Add your first delivery address.</Text>
                ) : (
                    <FlatList
                        data={addresses}
                        renderItem={renderAddressCard}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.listContainer}
                    />
                )}

            </ScrollView>

            {/* 4. Add Address Bottom Sheet */}
            <Modal
                visible={showAddressSheet}
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={closeAddressSheet}
            >
                <Pressable style={styles.sheetOverlay} onPress={closeAddressSheet}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
                        style={styles.keyboardView}
                    >
                    <Pressable
                        style={[styles.sheetContainer, { backgroundColor: colors.surface }]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.sheetScrollContent}
                        >
                        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

                        <Text style={[styles.formTitle, { color: colors.text }]}>{isEditingAddress ? 'Edit Address' : 'New Address'}</Text>

                        <View style={styles.typeSelector}>
                            {['Home', 'Work', 'Other'].map((l) => (
                                <TouchableOpacity
                                    key={l}
                                    onPress={() => setNewLabel(l as keyof typeof LABEL_TO_ADDRESS_TYPE)}
                                    style={[styles.typePill, { backgroundColor: newLabel === l ? colors.primary : colors.background, borderColor: colors.border }]}
                                >
                                    <Text style={[styles.typePillText, newLabel === l ? styles.typePillTextSelected : styles.typePillTextUnselected]}>{l}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>RECEIVER NAME</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                placeholder={displayName}
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
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>CITY</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                placeholder="e.g. Brooklyn"
                                placeholderTextColor={colors.textSecondary}
                                value={newCity}
                                onChangeText={setNewCity}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>STATE</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                placeholder="e.g. NY"
                                placeholderTextColor={colors.textSecondary}
                                value={newState}
                                onChangeText={setNewState}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>ZIP CODE</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                placeholder="e.g. 11201"
                                placeholderTextColor={colors.textSecondary}
                                value={newZipCode}
                                onChangeText={setNewZipCode}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>COUNTRY</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                placeholder="e.g. USA"
                                placeholderTextColor={colors.textSecondary}
                                value={newCountry}
                                onChangeText={setNewCountry}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.makePrimaryRow}
                            onPress={() => setNewIsPrimary((value) => !value)}
                        >
                            <View
                                style={[
                                    styles.primaryToggle,
                                    {
                                        borderColor: newIsPrimary ? colors.primary : colors.border,
                                        backgroundColor: newIsPrimary ? colors.primary : colors.background,
                                    },
                                ]}
                            >
                                {newIsPrimary ? (
                                    <AppIcon library="Feather" name="check" size={14} color="#FFF" />
                                ) : null}
                            </View>
                            <Text style={[styles.makePrimaryText, { color: colors.text }]}>Set as primary address</Text>
                        </TouchableOpacity>

                        <View style={styles.formActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={closeAddressSheet}>
                                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={styles.flexOne}>
                                <AppButton
                                    title={isSubmitting ? (isEditingAddress ? 'Updating...' : 'Saving...') : (isEditingAddress ? 'Update Address' : 'Save Address')}
                                    onPress={submitAddress}
                                    disabled={isSubmitting}
                                />
                            </View>
                        </View>
                        </ScrollView>
                    </Pressable>
                    </KeyboardAvoidingView>
                </Pressable>
            </Modal>

            {/* 5. Address Details Modal */}
            <Modal
                visible={!!selectedAddress}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() => setSelectedAddressId(null)}
            >
                <Pressable style={styles.detailsOverlay} onPress={() => setSelectedAddressId(null)}>
                    <Pressable
                        style={[styles.detailsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {selectedAddress ? (
                            <>
                                <View style={styles.detailsHeader}>
                                    <View style={[styles.iconBg, { backgroundColor: colors.primary + '15' }]}> 
                                        <AppIcon library="Feather" name={getAddressIcon(selectedAddress.address_type)} size={16} color={colors.primary} />
                                    </View>
                                    <View style={styles.detailsHeaderTextWrap}>
                                        <Text style={[styles.detailsTitle, { color: colors.text }]}>Address Details</Text>
                                        <Text style={[styles.detailsSubtitle, { color: colors.textSecondary }]}>{getAddressTypeLabel(selectedAddress.address_type)}</Text>
                                    </View>
                                    {selectedAddress.is_active ? (
                                        <View style={[styles.primaryBadge, { backgroundColor: colors.primary }]}> 
                                            <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                                        </View>
                                    ) : null}
                                </View>

                                <View style={styles.detailsBody}>
                                    <Text style={[styles.detailsName, { color: colors.text }]}>{displayName}</Text>
                                    <Text style={[styles.detailsLine, { color: colors.textSecondary }]}>{selectedAddress.address}</Text>
                                    <Text style={[styles.detailsLine, { color: colors.textSecondary }]}>{`${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zip_code}`}</Text>
                                    <Text style={[styles.detailsLine, { color: colors.textSecondary }]}>{selectedAddress.country}</Text>
                                </View>

                                <View style={styles.detailsActions}>
                                    <TouchableOpacity
                                        style={[styles.detailsEditBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                                        onPress={() => openEditAddressSheet(selectedAddress)}
                                    >
                                        <Text style={[styles.detailsEditBtnText, { color: colors.text }]}>Edit Address</Text>
                                    </TouchableOpacity>

                                    {!selectedAddress.is_active ? (
                                        <TouchableOpacity
                                            style={[styles.detailsPrimaryBtn, { borderColor: colors.primary }]}
                                            onPress={() => handleSetPrimary(selectedAddress.id)}
                                            disabled={isSettingPrimary === selectedAddress.id}
                                        >
                                            <Text style={[styles.detailsPrimaryBtnText, { color: colors.primary }]}> 
                                                {isSettingPrimary === selectedAddress.id ? 'Updating...' : 'Set as Primary'}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text style={[styles.detailsPrimaryHint, { color: colors.textSecondary }]}>This address is your active primary address.</Text>
                                    )}

                                    <TouchableOpacity
                                        style={[styles.detailsCloseBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                                        onPress={() => setSelectedAddressId(null)}
                                    >
                                        <Text style={[styles.detailsCloseBtnText, { color: colors.text }]}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : null}
                    </Pressable>
                </Pressable>
            </Modal>

        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    headerSpacer: { width: 40 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },
    sectionHeader: { fontSize: 16, fontWeight: '800', marginTop: 30, marginBottom: 15 },

    // Add Button Large
    addBtnLarge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', gap: 10 },
    addBtnLargeText: { fontSize: 15, fontWeight: '700' },

    // Form Styles
    sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    keyboardView: { flex: 1, justifyContent: 'flex-end' },
    sheetContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '88%' },
    sheetScrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36 },
    sheetHandle: { alignSelf: 'center', width: 48, height: 4, borderRadius: 4, marginBottom: 20 },
    formTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20 },
    typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    typePill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
    typePillText: { fontSize: 13, fontWeight: '700' },
    typePillTextSelected: { color: '#FFF' },
    typePillTextUnselected: { color: '#6B7280' },
    inputGroup: { marginBottom: 15 },
    inputLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
    input: { height: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontSize: 14 },
    makePrimaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
    primaryToggle: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    makePrimaryText: { fontSize: 14, fontWeight: '600' },
    formActions: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 10 },
    cancelBtn: { paddingHorizontal: 10 },
    cancelBtnText: { fontSize: 14, fontWeight: '700' },
    flexOne: { flex: 1 },

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
    emptyStateText: { fontSize: 14, lineHeight: 20, marginTop: 4 },
    errorText: { fontSize: 13, marginBottom: 12, color: '#EF4444' },

    setPrimaryBtn: { borderTopWidth: 1, paddingTop: 12, alignItems: 'center' },
    setPrimaryText: { fontSize: 13, fontWeight: '700' },

    // Address Details Modal
    detailsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    detailsContainer: { width: '100%', borderRadius: 18, borderWidth: 1, padding: 18 },
    detailsHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
    detailsHeaderTextWrap: { flex: 1 },
    detailsTitle: { fontSize: 17, fontWeight: '800' },
    detailsSubtitle: { fontSize: 13, marginTop: 2 },
    detailsBody: { marginBottom: 18 },
    detailsName: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
    detailsLine: { fontSize: 14, lineHeight: 20 },
    detailsActions: { gap: 10 },
    detailsEditBtn: { borderWidth: 1, borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center' },
    detailsEditBtnText: { fontSize: 14, fontWeight: '700' },
    detailsPrimaryBtn: { borderWidth: 1, borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center' },
    detailsPrimaryBtnText: { fontSize: 14, fontWeight: '700' },
    detailsPrimaryHint: { fontSize: 13, lineHeight: 18 },
    detailsCloseBtn: { borderWidth: 1, borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center' },
    detailsCloseBtnText: { fontSize: 14, fontWeight: '700' },
});

export default DeliveryAddressesScreen;