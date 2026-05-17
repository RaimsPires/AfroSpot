import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const METHOD_TYPES = ['card', 'mobile', 'paypal', 'bank'] as const;

type MethodType = (typeof METHOD_TYPES)[number];

const METHOD_TYPE_META: Record<MethodType, { label: string; icon: string; primaryLabel: string; primaryPlaceholder: string; secondaryLabel: string; secondaryPlaceholder: string }> = {
    card: {
        label: 'Card',
        icon: 'credit-card',
        primaryLabel: 'Card Brand',
        primaryPlaceholder: 'Visa, Mastercard...',
        secondaryLabel: 'Last 4 Digits',
        secondaryPlaceholder: '1234',
    },
    mobile: {
        label: 'Mobile Money',
        icon: 'smartphone',
        primaryLabel: 'Provider',
        primaryPlaceholder: 'MTN, Airtel, Unitel...',
        secondaryLabel: 'Wallet Number',
        secondaryPlaceholder: '+244 923 000 000',
    },
    paypal: {
        label: 'PayPal',
        icon: 'at-sign',
        primaryLabel: 'Account Name',
        primaryPlaceholder: 'Business or Owner Name',
        secondaryLabel: 'PayPal Email',
        secondaryPlaceholder: 'merchant@example.com',
    },
    bank: {
        label: 'Bank Account',
        icon: 'briefcase',
        primaryLabel: 'Bank Name',
        primaryPlaceholder: 'Your bank',
        secondaryLabel: 'Account Number',
        secondaryPlaceholder: '0001234567',
    },
};

const PAYMENT_METHODS = [
    { id: '1', type: 'card', primary: 'Visa', secondary: '9812', details: 'Expires 10/28', isDefault: true },
    { id: '2', type: 'mobile', primary: 'MTN Mobile Money', secondary: '+244 923 111 222', details: 'Primary wallet', isDefault: false },
    { id: '3', type: 'paypal', primary: 'AfroSpot Shop', secondary: 'merchant@afrospot.com', details: 'Verified account', isDefault: false },
];

type PaymentMethod = {
    id: string;
    type: MethodType;
    primary: string;
    secondary: string;
    details: string;
    isDefault: boolean;
};

export const PaymentMethodsScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const [methods, setMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [type, setType] = useState<MethodType>('card');
    const [primary, setPrimary] = useState('');
    const [secondary, setSecondary] = useState('');
    const [details, setDetails] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const isEditMode = useMemo(() => !!editingId, [editingId]);

    const resetForm = () => {
        setEditingId(null);
        setType('card');
        setPrimary('');
        setSecondary('');
        setDetails('');
        setIsDefault(false);
    };

    const openAddModal = () => {
        resetForm();
        setModalVisible(true);
    };

    const openEditModal = (method: PaymentMethod) => {
        setEditingId(method.id);
        setType(method.type);
        setPrimary(method.primary);
        setSecondary(method.secondary);
        setDetails(method.details);
        setIsDefault(method.isDefault);
        setModalVisible(true);
    };

    const handleSaveMethod = () => {
        const normalizedPrimary = primary.trim();
        const normalizedSecondary = secondary.trim();
        const normalizedDetails = details.trim();

        if (!normalizedPrimary || !normalizedSecondary) {
            return;
        }

        const normalizedSecondaryValue =
            type === 'card' ? normalizedSecondary.replace(/[^0-9]/g, '').slice(0, 4) : normalizedSecondary;

        if (type === 'card' && normalizedSecondaryValue.length !== 4) {
            return;
        }

        if (isEditMode && editingId) {
            setMethods((prev) =>
                prev.map((method) => {
                    if (method.id === editingId) {
                        return {
                            ...method,
                            type,
                            primary: normalizedPrimary,
                            secondary: normalizedSecondaryValue,
                            details: normalizedDetails || METHOD_TYPE_META[type].label,
                            isDefault,
                        };
                    }

                    if (isDefault) {
                        return { ...method, isDefault: false };
                    }

                    return method;
                }),
            );
        } else {
            const newMethod: PaymentMethod = {
                id: String(Date.now()),
                type,
                primary: normalizedPrimary,
                secondary: normalizedSecondaryValue,
                details: normalizedDetails || METHOD_TYPE_META[type].label,
                isDefault,
            };

            setMethods((prev) => {
                const withDefaultAdjusted = isDefault ? prev.map((item) => ({ ...item, isDefault: false })) : prev;
                return [newMethod, ...withDefaultAdjusted];
            });
        }

        setModalVisible(false);
        resetForm();
    };

    const handleRemoveMethod = (id: string) => {
        setMethods((prev) => {
            const remaining = prev.filter((method) => method.id !== id);
            if (!remaining.some((method) => method.isDefault) && remaining.length > 0) {
                remaining[0] = { ...remaining[0], isDefault: true };
            }
            return [...remaining];
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}> 
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Payment Methods</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={openAddModal}>
                    <AppIcon library="Feather" name="plus" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
                    {methods.map((method, index) => (
                        <View
                            key={method.id}
                            style={[
                                styles.methodRow,
                                index !== methods.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                            ]}
                        >
                            <View style={styles.methodLeft}>
                                <View style={[styles.iconBg, { backgroundColor: colors.primary + '15' }]}>
                                    <AppIcon library="Feather" name={METHOD_TYPE_META[method.type].icon as any} size={16} color={colors.primary} />
                                </View>
                                <View>
                                    <Text style={[styles.methodTitle, { color: colors.text }]}>{method.primary}</Text>
                                    <Text style={[styles.methodSub, { color: colors.textSecondary }]}>{method.secondary}</Text>
                                    <Text style={[styles.methodMeta, { color: colors.textSecondary }]}>{method.details}</Text>
                                </View>
                            </View>
                            <View style={styles.methodActions}>
                                {method.isDefault ? <Text style={[styles.defaultText, { color: colors.primary }]}>Default</Text> : null}
                                <TouchableOpacity onPress={() => openEditModal(method)}>
                                    <Text style={[styles.editText, { color: colors.text }]}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleRemoveMethod(method.id)}>
                                    <Text style={[styles.removeText, { color: colors.destructive }]}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={openAddModal}>
                    <AppIcon library="Feather" name="plus" size={16} color={colors.textInverse} />
                    <Text style={[styles.addBtnText, { color: colors.textInverse }]}>Add New Payment Method</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}> 
                    <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={() => setModalVisible(false)} />
                    <View style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{isEditMode ? 'Update Payment Method' : 'Add Payment Method'}</Text>

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Method Type</Text>
                        <View style={styles.typeRow}>
                            {METHOD_TYPES.map((methodType) => {
                                const selectedType = methodType === type;
                                return (
                                    <TouchableOpacity
                                        key={methodType}
                                        style={[
                                            styles.typeChip,
                                            {
                                                borderColor: selectedType ? colors.primary : colors.border,
                                                backgroundColor: selectedType ? colors.primary + '15' : colors.surface,
                                            },
                                        ]}
                                        onPress={() => setType(methodType)}
                                    >
                                        <Text style={[styles.typeChipText, { color: selectedType ? colors.primary : colors.text }]}>{METHOD_TYPE_META[methodType].label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{METHOD_TYPE_META[type].primaryLabel}</Text>
                        <TextInput
                            value={primary}
                            onChangeText={setPrimary}
                            placeholder={METHOD_TYPE_META[type].primaryPlaceholder}
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                        />

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{METHOD_TYPE_META[type].secondaryLabel}</Text>
                        <TextInput
                            value={secondary}
                            onChangeText={(value) => setSecondary(type === 'card' ? value.replace(/[^0-9]/g, '').slice(0, 4) : value)}
                            placeholder={METHOD_TYPE_META[type].secondaryPlaceholder}
                            placeholderTextColor={colors.textSecondary}
                            keyboardType={type === 'card' || type === 'mobile' || type === 'bank' ? 'number-pad' : 'default'}
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                        />

                        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Additional Details</Text>
                        <TextInput
                            value={details}
                            onChangeText={setDetails}
                            placeholder={type === 'card' ? 'Expires MM/YY' : 'Optional note'}
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                        />

                        <View style={styles.defaultRow}>
                            <Text style={[styles.defaultRowLabel, { color: colors.text }]}>Set as default</Text>
                            <Switch
                                value={isDefault}
                                onValueChange={setIsDefault}
                                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                                thumbColor={isDefault ? colors.primary : colors.surfaceElevated}
                            />
                        </View>

                        <View style={styles.modalActionRow}>
                            <TouchableOpacity
                                style={[styles.cancelBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
                                onPress={() => {
                                    setModalVisible(false);
                                    resetForm();
                                }}
                            >
                                <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSaveMethod}>
                                <Text style={[styles.saveBtnText, { color: colors.textInverse }]}>{isEditMode ? 'Update' : 'Add'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    iconBtn: { width: 32, alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '800' },
    content: { padding: 20, gap: 14 },
    card: { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
    methodRow: { paddingHorizontal: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconBg: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    methodTitle: { fontSize: 14, fontWeight: '700' },
    methodSub: { fontSize: 12, fontWeight: '500' },
    methodMeta: { fontSize: 11, fontWeight: '500', marginTop: 2 },
    methodActions: { alignItems: 'flex-end', gap: 6 },
    defaultText: { fontSize: 12, fontWeight: '800' },
    editText: { fontSize: 12, fontWeight: '700' },
    removeText: { fontSize: 12, fontWeight: '700' },
    addBtn: { borderRadius: 12, paddingVertical: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
    addBtnText: { fontSize: 14, fontWeight: '800' },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
    modalCard: {
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderBottomWidth: 0,
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    modalTitle: { fontSize: 17, fontWeight: '800', marginBottom: 10 },
    fieldLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6, marginTop: 8 },
    typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
    typeChip: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
    typeChipText: { fontSize: 12, fontWeight: '700' },
    input: {
        height: 44,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 14,
    },
    defaultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
    defaultRowLabel: { fontSize: 14, fontWeight: '600' },
    modalActionRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
    cancelBtn: { flex: 1, borderWidth: 1, borderRadius: 12, alignItems: 'center', paddingVertical: 12 },
    cancelBtnText: { fontSize: 14, fontWeight: '700' },
    saveBtn: { flex: 1, borderRadius: 12, alignItems: 'center', paddingVertical: 12 },
    saveBtnText: { fontSize: 14, fontWeight: '800' },
});
