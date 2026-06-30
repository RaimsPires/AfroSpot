import React, { useEffect, useMemo, useState } from 'react';
import { GetCity, GetCountries, GetState } from 'react-country-state-city';
import type {
    City,
    Country,
    State,
} from 'react-country-state-city/dist/cjs/types';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon, ConfirmationModal } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { AppStackNavigationProp } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@store/authStore';
import { UserAddress } from '@type/auth';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddressCard from './components/deliveryAddresses/AddressCard';
import AddressDetailsModal from './components/deliveryAddresses/AddressDetailsModal';
import AddressFormSheet from './components/deliveryAddresses/AddressFormSheet';
import {
    AddressLabel,
    findCountryOptionByValue,
    findStateOptionByValue,
    LABEL_TO_ADDRESS_TYPE,
    LocationOption,
} from './components/deliveryAddresses/addressUtils';

const DeliveryAddressesScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'DeliveryAddresses'>>();
    const { colors, isDark } = useTheme();
    const { t } = useTranslation();
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const addAddress = useAuthStore((state) => state.addAddress);
    const updateAddress = useAuthStore((state) => state.updateAddress);
    const setPrimaryAddress = useAuthStore((state) => state.setPrimaryAddress);
    const deleteAddress = useAuthStore((state) => state.deleteAddress);

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
    const [pendingDeleteAddress, setPendingDeleteAddress] = useState<UserAddress | null>(null);
    const [isDeletingAddress, setIsDeletingAddress] = useState(false);

    const [newLabel, setNewLabel] = useState<AddressLabel>('Home');
    const [newName, setNewName] = useState('');
    const [newStreet, setNewStreet] = useState('');
    const [newCity, setNewCity] = useState('');
    const [newState, setNewState] = useState('');
    const [newZipCode, setNewZipCode] = useState('');
    const [newCountry, setNewCountry] = useState('');
    const [newCountryIsoCode, setNewCountryIsoCode] = useState<string | null>(null);
    const [newStateIsoCode, setNewStateIsoCode] = useState<string | null>(null);
    const [newIsPrimary, setNewIsPrimary] = useState(false);
    const [activePicker, setActivePicker] = useState<'country' | 'state' | 'city' | null>(null);
    const [countryOptions, setCountryOptions] = useState<LocationOption[]>([]);
    const [stateOptions, setStateOptions] = useState<LocationOption[]>([]);
    const [cityOptions, setCityOptions] = useState<LocationOption[]>([]);

    useEffect(() => {
        let isMounted = true;

        GetCountries()
            .then((countries) => {
                if (!isMounted) {
                    return;
                }

                const mappedCountries = countries
                    .map((country: Country) => ({
                        id: country.id,
                        label: country.name,
                        value: country.name,
                        isoCode: country.iso2,
                    }))
                    .sort((a: LocationOption, b: LocationOption) => a.label.localeCompare(b.label));

                setCountryOptions(mappedCountries);
            })
            .catch(() => {
                if (isMounted) {
                    setCountryOptions([]);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const selectedCountry = countryOptions.find((country) => country.isoCode === newCountryIsoCode);

        if (!selectedCountry?.id) {
            setStateOptions([]);
            setCityOptions([]);
            return;
        }

        let isMounted = true;

        GetState(selectedCountry.id)
            .then((states) => {
                if (!isMounted) {
                    return;
                }

                const mappedStates = states
                    .map((stateItem: State) => ({
                        id: stateItem.id,
                        label: stateItem.name,
                        value: stateItem.name,
                        isoCode: stateItem.state_code,
                    }))
                    .sort((a: LocationOption, b: LocationOption) => a.label.localeCompare(b.label));

                setStateOptions(mappedStates);
            })
            .catch(() => {
                if (isMounted) {
                    setStateOptions([]);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [countryOptions, newCountryIsoCode]);

    useEffect(() => {
        const selectedCountry = countryOptions.find((country) => country.isoCode === newCountryIsoCode);
        const selectedState = stateOptions.find((stateItem) => {
            if (newStateIsoCode) {
                return stateItem.isoCode === newStateIsoCode;
            }

            return stateItem.label === newState;
        });

        if (!selectedCountry?.id || !selectedState?.id) {
            setCityOptions([]);
            return;
        }

        let isMounted = true;

        GetCity(selectedCountry.id, selectedState.id)
            .then((cities) => {
                if (!isMounted) {
                    return;
                }

                const mappedCities = cities
                    .map((cityItem: City) => ({
                        id: cityItem.id,
                        label: cityItem.name,
                        value: cityItem.name,
                    }))
                    .sort((a: LocationOption, b: LocationOption) => a.label.localeCompare(b.label));

                setCityOptions(mappedCities);
            })
            .catch(() => {
                if (isMounted) {
                    setCityOptions([]);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [countryOptions, newCountryIsoCode, newState, newStateIsoCode, stateOptions]);

    useEffect(() => {
        if (newCountryIsoCode || !newCountry) {
            return;
        }

        const matchedCountry = findCountryOptionByValue(countryOptions, newCountry);

        if (matchedCountry?.isoCode) {
            setNewCountry(matchedCountry.label);
            setNewCountryIsoCode(matchedCountry.isoCode);
        }
    }, [countryOptions, newCountry, newCountryIsoCode]);

    useEffect(() => {
        if (newStateIsoCode || !newState || stateOptions.length === 0) {
            return;
        }

        const matchedState = findStateOptionByValue(stateOptions, newState);

        if (matchedState?.isoCode) {
            setNewState(matchedState.label);
            setNewStateIsoCode(matchedState.isoCode);
        }
    }, [newState, newStateIsoCode, stateOptions]);

    const isStateDisabled = !newCountryIsoCode || stateOptions.length === 0;
    const isCityDisabled = !newState.trim() || cityOptions.length === 0;

    const pickerTitle = useMemo(() => {
        if (activePicker === 'country') {
            return t('addresses.pickers.selectCountry');
        }

        if (activePicker === 'state') {
            return t('addresses.pickers.selectState');
        }

        if (activePicker === 'city') {
            return t('addresses.pickers.selectCity');
        }

        return '';
    }, [activePicker, t]);

    const activePickerOptions = useMemo(() => {
        if (activePicker === 'country') {
            return countryOptions;
        }

        if (activePicker === 'state') {
            return stateOptions;
        }

        if (activePicker === 'city') {
            return cityOptions;
        }

        return [];
    }, [activePicker, cityOptions, countryOptions, stateOptions]);

    const displayName = useMemo(() => {
        if (!user) {
            return t('addresses.fallbackUserName');
        }

        const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
        return fullName || user.email;
    }, [t, user]);

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
        setNewCountryIsoCode(null);
        setNewStateIsoCode(null);
        setNewIsPrimary(false);
        setActivePicker(null);
        setCityOptions([]);
    };

    const populateForm = (address: UserAddress) => {
        const matchedCountry = findCountryOptionByValue(countryOptions, address.country);
        const matchedState = findStateOptionByValue(stateOptions, address.state);

        setNewLabel(address.address_type === 'home' ? 'Home' : address.address_type === 'work' ? 'Work' : 'Other');
        setNewName(displayName);
        setNewStreet(address.address);
        setNewCity(address.city);
        setNewState(matchedState?.label ?? address.state);
        setNewZipCode(address.zip_code);
        setNewCountry(matchedCountry?.label ?? address.country);
        setNewCountryIsoCode(matchedCountry?.isoCode ?? null);
        setNewStateIsoCode(matchedState?.isoCode ?? null);
        setNewIsPrimary(address.is_active);
        setActivePicker(null);
    };

    const closePickerModal = () => {
        setActivePicker(null);
    };

    const handleCountrySelection = (option: LocationOption) => {
        setNewCountry(option.label);
        setNewCountryIsoCode(option.isoCode ?? null);
        setNewState('');
        setNewStateIsoCode(null);
        setNewCity('');
        closePickerModal();
    };

    const handleStateSelection = (option: LocationOption) => {
        setNewState(option.label);
        setNewStateIsoCode(option.isoCode ?? null);
        setNewCity('');
        closePickerModal();
    };

    const handleCitySelection = (option: LocationOption) => {
        setNewCity(option.label);
        closePickerModal();
    };

    const handlePickerSelection = (option: LocationOption) => {
        if (activePicker === 'country') {
            handleCountrySelection(option);
            return;
        }

        if (activePicker === 'state') {
            handleStateSelection(option);
            return;
        }

        if (activePicker === 'city') {
            handleCitySelection(option);
        }
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
            setErrorMessage(t('addresses.errors.requiredFields'));
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
                ? t('addresses.errors.updateFailed')
                : t('addresses.errors.saveFailed'));
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
            Alert.alert(
                t('addresses.alerts.updateFailedTitle'),
                t('addresses.alerts.setPrimaryFailedMessage'),
            );
        } finally {
            setIsSettingPrimary(null);
        }
    };

    const handleRequestDelete = (address: UserAddress) => {
        setPendingDeleteAddress(address);
    };

    const handleCancelDelete = () => {
        setPendingDeleteAddress(null);
    };

    const handleConfirmDelete = async () => {
        if (!pendingDeleteAddress) {
            return;
        }

        try {
            setIsDeletingAddress(true);
            await deleteAddress(pendingDeleteAddress.id);
            setPendingDeleteAddress(null);
            setSelectedAddressId(null);
        } catch {
            Alert.alert(
                t('addresses.alerts.deleteFailedTitle'),
                t('addresses.alerts.deleteFailedMessage'),
            );
        } finally {
            setIsDeletingAddress(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {isDeletingAddress ? (
                <View style={styles.fullscreenLoader}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : null}

            <View style={[styles.header, { backgroundColor: colors.background }]}> 
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('addresses.title')}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity
                    style={[styles.addBtnLarge, { borderColor: colors.primary, backgroundColor: `${colors.primary}05` }]}
                    onPress={openAddAddressSheet}
                >
                    <AppIcon library="Feather" name="plus-circle" size={20} color={colors.primary} />
                    <Text style={[styles.addBtnLargeText, { color: colors.primary }]}>{t('addresses.actions.addNewAddress')}</Text>
                </TouchableOpacity>

                <Text style={[styles.sectionHeader, { color: colors.text }]}>{t('addresses.savedAddresses')}</Text>
                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                {loading && addresses.length === 0 ? (
                    <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>{t('addresses.loading')}</Text>
                ) : null}

                {!loading && addresses.length === 0 ? (
                    <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>{t('addresses.emptyState')}</Text>
                ) : (
                    <FlatList
                        data={addresses}
                        renderItem={({ item }) => (
                            <AddressCard
                                item={item}
                                colors={colors}
                                displayName={displayName}
                                isSettingPrimary={isSettingPrimary === item.id}
                                onEdit={openEditAddressSheet}
                                onSelect={setSelectedAddressId}
                                onSetPrimary={handleSetPrimary}
                                onDelete={handleRequestDelete}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </ScrollView>

            <AddressFormSheet
                visible={showAddressSheet}
                colors={colors}
                isEditingAddress={isEditingAddress}
                isSubmitting={isSubmitting}
                activePicker={activePicker}
                pickerTitle={pickerTitle}
                pickerOptions={activePickerOptions}
                displayName={displayName}
                newLabel={newLabel}
                newName={newName}
                newStreet={newStreet}
                newCountry={newCountry}
                newState={newState}
                newCity={newCity}
                newZipCode={newZipCode}
                newCountryIsoCode={newCountryIsoCode}
                newIsPrimary={newIsPrimary}
                isStateDisabled={isStateDisabled}
                isCityDisabled={isCityDisabled}
                onClose={closeAddressSheet}
                onSubmit={submitAddress}
                onClosePicker={closePickerModal}
                onSelectPickerOption={handlePickerSelection}
                onOpenCountryPicker={() => {
                    setActivePicker('country');
                }}
                onOpenStatePicker={() => {
                    if (!isStateDisabled) {
                        setActivePicker('state');
                    }
                }}
                onOpenCityPicker={() => {
                    if (!isCityDisabled) {
                        setActivePicker('city');
                    }
                }}
                onSetNewLabel={setNewLabel}
                onSetNewName={setNewName}
                onSetNewStreet={setNewStreet}
                onSetNewZipCode={setNewZipCode}
                onTogglePrimary={() => setNewIsPrimary((value) => !value)}
            />

            <AddressDetailsModal
                address={selectedAddress}
                colors={colors}
                displayName={displayName}
                isSettingPrimary={isSettingPrimary === selectedAddress?.id}
                onClose={() => setSelectedAddressId(null)}
                onEdit={openEditAddressSheet}
                onSetPrimary={handleSetPrimary}
                onDelete={handleRequestDelete}
            />

            <ConfirmationModal
                visible={Boolean(pendingDeleteAddress)}
                title={t('addresses.deleteConfirm.title')}
                message={t('addresses.deleteConfirm.message')}
                confirmLabel={t('addresses.deleteConfirm.confirmLabel')}
                cancelLabel={t('addresses.deleteConfirm.cancelLabel')}
                variant="danger"
                isLoading={isDeletingAddress}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                colors={colors}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    fullscreenLoader: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    headerSpacer: { width: 40 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },
    sectionHeader: { fontSize: 16, fontWeight: '800', marginTop: 30, marginBottom: 15 },
    addBtnLarge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', gap: 10 },
    addBtnLargeText: { fontSize: 15, fontWeight: '700' },
    listContainer: { gap: 16 },
    emptyStateText: { fontSize: 14, lineHeight: 20, marginTop: 4 },
    errorText: { fontSize: 13, marginBottom: 12, color: '#EF4444' },
});

export default DeliveryAddressesScreen;