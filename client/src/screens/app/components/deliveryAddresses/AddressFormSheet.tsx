import React from 'react';
import {
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

import { AddressLabel, LABEL_TO_ADDRESS_TYPE } from './addressUtils';

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
    displayName: string;
    newLabel: AddressLabel;
    newName: string;
    newStreet: string;
    newCountry: string;
    newState: string;
    newCity: string;
    newZipCode: string;
    newCountryIsoCode: string | null;
    newStateIsoCode: string | null;
    newIsPrimary: boolean;
    isStateDisabled: boolean;
    isCityDisabled: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onOpenCountryPicker: () => void;
    onOpenStatePicker: () => void;
    onOpenCityPicker: () => void;
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
    displayName,
    newLabel,
    newName,
    newStreet,
    newCountry,
    newState,
    newCity,
    newZipCode,
    newCountryIsoCode,
    newStateIsoCode,
    newIsPrimary,
    isStateDisabled,
    isCityDisabled,
    onClose,
    onSubmit,
    onOpenCountryPicker,
    onOpenStatePicker,
    onOpenCityPicker,
    onSetNewLabel,
    onSetNewName,
    onSetNewStreet,
    onSetNewZipCode,
    onTogglePrimary,
}: AddressFormSheetProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            statusBarTranslucent
            onRequestClose={onClose}
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
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.sheetScrollContent}
                        >
                            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

                            <Text style={[styles.formTitle, { color: colors.text }]}>{isEditingAddress ? 'Edit Address' : 'New Address'}</Text>

                            <View style={styles.typeSelector}>
                                {Object.keys(LABEL_TO_ADDRESS_TYPE).map((label) => {
                                    const typedLabel = label as AddressLabel;

                                    return (
                                        <TouchableOpacity
                                            key={typedLabel}
                                            onPress={() => onSetNewLabel(typedLabel)}
                                            style={[styles.typePill, { backgroundColor: newLabel === typedLabel ? colors.primary : colors.background, borderColor: colors.border }]}
                                        >
                                            <Text style={[styles.typePillText, newLabel === typedLabel ? styles.typePillTextSelected : styles.typePillTextUnselected]}>{typedLabel}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>RECEIVER NAME</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                    placeholder={displayName}
                                    placeholderTextColor={colors.textSecondary}
                                    value={newName}
                                    onChangeText={onSetNewName}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>STREET ADDRESS</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                    placeholder="e.g. 124 Atlantic Ave"
                                    placeholderTextColor={colors.textSecondary}
                                    value={newStreet}
                                    onChangeText={onSetNewStreet}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>COUNTRY</Text>
                                <Pressable
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
                                        {newCountry || 'Select country'}
                                    </Text>
                                    <AppIcon library="Feather" name="chevron-down" size={16} color={colors.textSecondary} />
                                </Pressable>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>STATE</Text>
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
                                        {newState || (newCountryIsoCode ? 'Select state' : 'Select country first')}
                                    </Text>
                                    <AppIcon library="Feather" name="chevron-down" size={16} color={colors.textSecondary} />
                                </Pressable>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>CITY</Text>
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
                                        {newCity || (newStateIsoCode ? 'Select city' : 'Select state first')}
                                    </Text>
                                    <AppIcon library="Feather" name="chevron-down" size={16} color={colors.textSecondary} />
                                </Pressable>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>ZIP CODE</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                                    placeholder="e.g. 11201"
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
                                <Text style={[styles.makePrimaryText, { color: colors.text }]}>Set as primary address</Text>
                            </TouchableOpacity>

                            <View style={styles.formActions}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                                    <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                                </TouchableOpacity>
                                <View style={styles.flexOne}>
                                    <AppButton
                                        title={isSubmitting ? (isEditingAddress ? 'Updating...' : 'Saving...') : (isEditingAddress ? 'Update Address' : 'Save Address')}
                                        onPress={onSubmit}
                                        disabled={isSubmitting}
                                    />
                                </View>
                            </View>
                        </ScrollView>
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
    flexOne: { flex: 1 },
});

export default AddressFormSheet;
