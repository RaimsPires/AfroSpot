import React from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTranslation } from 'react-i18next';

import { AddressLabel, LABEL_TO_ADDRESS_TYPE, LocationOption } from './addressUtils';

type FormColors = {
    surface: string;
    background: string;
    border: string;
    primary: string;
    text: string;
    textSecondary: string;
};

type AddressFormSheetProps = {
    visible: boolean;
    colors: FormColors;
    isEditingAddress: boolean;
    isSubmitting: boolean;
    activePicker: 'country' | 'state' | 'city' | null;
    pickerTitle: string;
    pickerOptions: LocationOption[];
    displayName: string;
    newLabel: AddressLabel;
    newName: string;
    newStreet: string;
    newCountry: string;
    newState: string;
    newCity: string;
    newZipCode: string;
    newCountryIsoCode: string | null;
    newIsPrimary: boolean;
    isStateDisabled: boolean;
    isCityDisabled: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onOpenCountryPicker: () => void;
    onOpenStatePicker: () => void;
    onOpenCityPicker: () => void;
    onClosePicker: () => void;
    onSelectPickerOption: (option: LocationOption) => void;
    onSetNewLabel: (label: AddressLabel) => void;
    onSetNewName: (value: string) => void;
    onSetNewStreet: (value: string) => void;
    onSetNewZipCode: (value: string) => void;
    onTogglePrimary: () => void;
};

const AddressFormSheet = ({
    visible,
    colors,
    isEditingAddress,
    isSubmitting,
    activePicker,
    pickerTitle,
    pickerOptions,
    displayName,
    newLabel,
    newName,
    newStreet,
    newCountry,
    newState,
    newCity,
    newZipCode,
    newCountryIsoCode,
    newIsPrimary,
    isStateDisabled,
    isCityDisabled,
    onClose,
    onSubmit,
    onOpenCountryPicker,
    onOpenStatePicker,
    onOpenCityPicker,
    onClosePicker,
    onSelectPickerOption,
    onSetNewLabel,
    onSetNewName,
    onSetNewStreet,
    onSetNewZipCode,
    onTogglePrimary,
}: AddressFormSheetProps) => {
    const { t } = useTranslation();

    const isPickerActive = activePicker !== null;
    const isFormValid = Boolean(
        newStreet.trim() && newCity.trim() && newState.trim() && newZipCode.trim() && newCountry.trim(),
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            presentationStyle="overFullScreen"
            statusBarTranslucent
            onRequestClose={isPickerActive ? onClosePicker : onClose}
        >
            <Pressable style={styles.sheetOverlay} onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
                    style={styles.keyboardView}
                >
                    <Pressable
                        style={[styles.sheetContainer, { backgroundColor: colors.surface }]}
                        onPress={(event) => event.stopPropagation()}
                    >
                        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

                        {isPickerActive ? (
                            <View style={styles.pickerHeader}>
                                <TouchableOpacity
                                    style={styles.pickerBackButton}
                                    onPress={onClosePicker}
                                >
                                    <AppIcon library="Feather" name="chevron-left" size={20} color={colors.text} />
                                </TouchableOpacity>
                                <Text style={[styles.pickerTitle, { color: colors.text }]}>{pickerTitle}</Text>
                                <View style={styles.pickerHeaderSpacer} />
                            </View>
                        ) : (
                            <Text style={[styles.formTitle, { color: colors.text }]}>
                                {isEditingAddress ? t('deliveryAddresses.form.editTitle') : t('deliveryAddresses.form.newTitle')}
                            </Text>
                        )}

                        {isPickerActive ? (
                            <FlatList
                                data={pickerOptions}
                                keyExtractor={(item) => `${item.value}-${item.isoCode ?? 'none'}`}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.pickerOptionRow, { borderBottomColor: colors.border }]}
                                        onPress={() => onSelectPickerOption(item)}
                                    >
                                        <Text style={[styles.pickerOptionText, { color: colors.text }]}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={(
                                    <Text style={[styles.pickerEmptyText, { color: colors.textSecondary }]}>{t('deliveryAddresses.pickers.noOptions')}</Text>
                                )}
                                keyboardShouldPersistTaps="handled"
                            />
                        ) : (
                            <ScrollView
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.sheetScrollContent}
                            >
                                <View style={styles.typeSelector}>
                                    {Object.keys(LABEL_TO_ADDRESS_TYPE).map((label) => {
                                        const typedLabel = label as AddressLabel;

                                        return (
                                            <TouchableOpacity
                                                key={typedLabel}
                                                onPress={() => onSetNewLabel(typedLabel)}
                                                style={[styles.typePill, { backgroundColor: newLabel === typedLabel ? colors.primary : colors.background, borderColor: colors.border }]}
                                            >
                                                <Text style={[styles.typePillText, newLabel === typedLabel ? styles.typePillTextSelected : styles.typePillTextUnselected]}>
                                                    {t(`deliveryAddresses.labels.${typedLabel.toLowerCase()}`)}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.form.receiverNameLabel')}</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                        placeholder={displayName}
                                        placeholderTextColor={colors.textSecondary}
                                        value={newName}
                                        onChangeText={onSetNewName}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.form.streetAddressLabel')}</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                        placeholder={t('deliveryAddresses.form.streetPlaceholder')}
                                        placeholderTextColor={colors.textSecondary}
                                        value={newStreet}
                                        onChangeText={onSetNewStreet}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.fields.country')}</Text>
                                    <TouchableOpacity
                                        onPress={onOpenCountryPicker}
                                        style={[
                                            styles.selectField,
                                            {
                                                borderColor: colors.border,
                                                backgroundColor: colors.background,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.selectFieldText,
                                                { color: newCountry ? colors.text : colors.textSecondary },
                                            ]}
                                        >
                                            {newCountry || t('deliveryAddresses.pickers.selectCountry')}
                                        </Text>
                                        <AppIcon library="Feather" name="chevron-down" size={16} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.fields.state')}</Text>
                                    <Pressable
                                        onPress={onOpenStatePicker}
                                        style={[
                                            styles.selectField,
                                            {
                                                borderColor: colors.border,
                                                backgroundColor: isStateDisabled ? colors.surface : colors.background,
                                            },
                                            isStateDisabled ? styles.selectFieldDisabled : null,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.selectFieldText,
                                                { color: newState ? colors.text : colors.textSecondary },
                                            ]}
                                        >
                                            {newState || (newCountryIsoCode ? t('deliveryAddresses.pickers.selectState') : t('deliveryAddresses.pickers.selectCountryFirst'))}
                                        </Text>
                                        <AppIcon library="Feather" name="chevron-down" size={16} color={colors.textSecondary} />
                                    </Pressable>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.fields.city')}</Text>
                                    <Pressable
                                        onPress={onOpenCityPicker}
                                        style={[
                                            styles.selectField,
                                            {
                                                borderColor: colors.border,
                                                backgroundColor: isCityDisabled ? colors.surface : colors.background,
                                            },
                                            isCityDisabled ? styles.selectFieldDisabled : null,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.selectFieldText,
                                                { color: newCity ? colors.text : colors.textSecondary },
                                            ]}
                                        >
                                            {newCity || (newState ? t('deliveryAddresses.pickers.selectCity') : t('deliveryAddresses.pickers.selectStateFirst'))}
                                        </Text>
                                        <AppIcon library="Feather" name="chevron-down" size={16} color={colors.textSecondary} />
                                    </Pressable>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.fields.zipCode')}</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                        placeholder={t('deliveryAddresses.form.zipPlaceholder')}
                                        placeholderTextColor={colors.textSecondary}
                                        value={newZipCode}
                                        onChangeText={onSetNewZipCode}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.makePrimaryRow}
                                    onPress={onTogglePrimary}
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
                                    <Text style={[styles.makePrimaryText, { color: colors.text }]}>{t('deliveryAddresses.actions.setAsPrimaryAddress')}</Text>
                                </TouchableOpacity>

                                <View style={styles.formActions}>
                                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                                        <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>{t('common.actions.cancel')}</Text>
                                    </TouchableOpacity>
                                    <View style={styles.flexOne}>
                                        <AppButton
                                            title={isSubmitting
                                                ? (isEditingAddress ? t('deliveryAddresses.actions.updating') : t('deliveryAddresses.actions.saving'))
                                                : (isEditingAddress ? t('deliveryAddresses.actions.updateAddress') : t('deliveryAddresses.actions.saveAddress'))}
                                            onPress={onSubmit}
                                            disabled={!isFormValid || isSubmitting}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    keyboardView: { flex: 1, justifyContent: 'flex-end' },
    sheetContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '88%' },
    sheetScrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 36 },
    sheetHandle: { alignSelf: 'center', width: 48, height: 4, borderRadius: 4, marginBottom: 20 },
    pickerHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
    pickerBackButton: { width: 32, height: 32, alignItems: 'flex-start', justifyContent: 'center' },
    pickerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800' },
    pickerHeaderSpacer: { width: 32 },
    formTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20, paddingHorizontal: 16, paddingVertical: 8, },
    typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    typePill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
    typePillText: { fontSize: 13, fontWeight: '700' },
    typePillTextSelected: { color: '#FFF' },
    typePillTextUnselected: { color: '#6B7280' },
    inputGroup: { marginBottom: 15 },
    inputLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
    input: { height: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontSize: 14 },
    selectField: {
        height: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectFieldText: {
        fontSize: 14,
        flexShrink: 1,
    },
    selectFieldDisabled: {
        opacity: 0.8,
    },
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
    pickerOptionRow: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    pickerOptionText: {
        fontSize: 14,
        fontWeight: '600',
    },
    pickerEmptyText: {
        fontSize: 13,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    flexOne: { flex: 1 },
});

export default AddressFormSheet;
