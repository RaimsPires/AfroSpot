import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { LocationOption } from './addressUtils';

type PickerColors = {
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
};

type LocationPickerModalProps = {
    activePicker: 'country' | 'state' | 'city' | null;
    title: string;
    options: LocationOption[];
    colors: PickerColors;
    onClose: () => void;
    onSelect: (option: LocationOption) => void;
};

const LocationPickerModal = ({
    activePicker,
    title,
    options,
    colors,
    onClose,
    onSelect,
}: LocationPickerModalProps) => {
    return (
        <Modal
            visible={activePicker !== null}
            transparent
            animationType="fade"
            presentationStyle="overFullScreen"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <Pressable style={styles.pickerOverlay} onPress={onClose}>
                <Pressable
                    style={[styles.pickerContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={(event) => event.stopPropagation()}
                >
                    <Text style={[styles.pickerTitle, { color: colors.text }]}>{title}</Text>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => `${item.value}-${item.isoCode ?? 'none'}`}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.pickerOptionRow, { borderBottomColor: colors.border }]}
                                onPress={() => onSelect(item)}
                            >
                                <Text style={[styles.pickerOptionText, { color: colors.text }]}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={(
                            <Text style={[styles.pickerEmptyText, { color: colors.textSecondary }]}>No options available.</Text>
                        )}
                        keyboardShouldPersistTaps="handled"
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    pickerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: 28,
    },
    pickerContainer: {
        borderRadius: 16,
        borderWidth: 1,
        maxHeight: '60%',
        overflow: 'hidden',
    },
    pickerTitle: {
        fontSize: 16,
        fontWeight: '800',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
    },
    pickerOptionRow: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    pickerOptionText: {
        fontSize: 14,
        fontWeight: '600',
    },
    pickerEmptyText: {
        fontSize: 13,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
});

export default LocationPickerModal;
