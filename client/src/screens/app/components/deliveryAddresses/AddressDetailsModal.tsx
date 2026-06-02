import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { UserAddress } from '@type/auth';
import { useTranslation } from 'react-i18next';

import { getAddressIcon, getAddressTypeLabel } from './addressUtils';

type DetailsColors = {
    surface: string;
    border: string;
    primary: string;
    text: string;
    textSecondary: string;
    background: string;
};

type AddressDetailsModalProps = {
    address: UserAddress | null;
    colors: DetailsColors;
    displayName: string;
    isSettingPrimary: boolean;
    onClose: () => void;
    onEdit: (address: UserAddress) => void;
    onSetPrimary: (addressId: string) => void;
    onDelete: (address: UserAddress) => void;
};

const AddressDetailsModal = ({
    address,
    colors,
    displayName,
    isSettingPrimary,
    onClose,
    onEdit,
    onSetPrimary,
    onDelete,
}: AddressDetailsModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal
            visible={Boolean(address)}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <Pressable style={styles.detailsOverlay} onPress={onClose}>
                <Pressable
                    style={[styles.detailsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={(event) => event.stopPropagation()}
                >
                    {address ? (
                        <>
                            <View style={styles.detailsHeader}>
                                <View style={[styles.iconBg, { backgroundColor: `${colors.primary}15` }]}>
                                    <AppIcon library="Feather" name={getAddressIcon(address.address_type)} size={16} color={colors.primary} />
                                </View>
                                <View style={styles.detailsHeaderTextWrap}>
                                    <Text style={[styles.detailsTitle, { color: colors.text }]}>{t('deliveryAddresses.details.title')}</Text>
                                    <Text style={[styles.detailsSubtitle, { color: colors.textSecondary }]}>{t(`deliveryAddresses.labels.${getAddressTypeLabel(address.address_type).toLowerCase()}`)}</Text>
                                </View>
                                {address.is_active ? (
                                    <View style={[styles.primaryBadge, { backgroundColor: colors.primary }]}> 
                                        <Text style={styles.primaryBadgeText}>{t('deliveryAddresses.badges.primary')}</Text>
                                    </View>
                                ) : null}
                            </View>

                            <View style={styles.detailsBody}>
                                <View style={styles.detailsRow}>
                                    <Text style={[styles.detailsRowLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.fields.name')}</Text>
                                    <Text style={[styles.detailsRowValue, { color: colors.text }]}>{displayName}</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={[styles.detailsRowLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.fields.street')}</Text>
                                    <Text style={[styles.detailsRowValue, { color: colors.text }]}>{address.address}</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={[styles.detailsRowLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.fields.city')}</Text>
                                    <Text style={[styles.detailsRowValue, { color: colors.text }]}>{address.city}</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={[styles.detailsRowLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.fields.state')}</Text>
                                    <Text style={[styles.detailsRowValue, { color: colors.text }]}>{address.state}</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={[styles.detailsRowLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.fields.zipCode')}</Text>
                                    <Text style={[styles.detailsRowValue, { color: colors.text }]}>{address.zip_code}</Text>
                                </View>
                                <View style={[styles.detailsRow, styles.detailsRowLast]}>
                                    <Text style={[styles.detailsRowLabel, { color: colors.textSecondary }]}>{t('deliveryAddresses.fields.country')}</Text>
                                    <Text style={[styles.detailsRowValue, { color: colors.text }]}>{address.country}</Text>
                                </View>
                            </View>

                            <View style={styles.detailsActions}>
                                <TouchableOpacity
                                    style={[styles.detailsEditBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                                    onPress={() => onEdit(address)}
                                >
                                    <Text style={[styles.detailsEditBtnText, { color: colors.text }]}>{t('deliveryAddresses.actions.editAddress')}</Text>
                                </TouchableOpacity>

                                {!address.is_active ? (
                                    <TouchableOpacity
                                        style={[styles.detailsPrimaryBtn, { borderColor: colors.primary }]}
                                        onPress={() => onSetPrimary(address.id)}
                                        disabled={isSettingPrimary}
                                    >
                                        <Text style={[styles.detailsPrimaryBtnText, { color: colors.primary }]}> 
                                            {isSettingPrimary ? t('deliveryAddresses.actions.updating') : t('deliveryAddresses.actions.setAsPrimary')}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Text style={[styles.detailsPrimaryHint, { color: colors.textSecondary }]}>{t('deliveryAddresses.details.primaryHint')}</Text>
                                )}

                                {!address.is_active ? (
                                    <TouchableOpacity
                                        style={styles.detailsDeleteBtn}
                                        onPress={() => { onDelete(address); onClose(); }}
                                    >
                                        <Text style={styles.detailsDeleteBtnText}>{t('deliveryAddresses.actions.deleteAddress')}</Text>
                                    </TouchableOpacity>
                                ) : null}

                                <TouchableOpacity
                                    style={[styles.detailsCloseBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                                    onPress={onClose}
                                >
                                    <Text style={[styles.detailsCloseBtnText, { color: colors.text }]}>{t('deliveryAddresses.actions.close')}</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : null}
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    detailsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    detailsContainer: { width: '100%', borderRadius: 18, borderWidth: 1, padding: 18 },
    detailsHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
    iconBg: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    detailsHeaderTextWrap: { flex: 1 },
    detailsTitle: { fontSize: 17, fontWeight: '800' },
    detailsSubtitle: { fontSize: 13, marginTop: 2 },
    primaryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    primaryBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
    detailsBody: { marginBottom: 18, borderRadius: 10, borderWidth: 1, overflow: 'hidden' },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
    detailsRowLast: { borderBottomWidth: 0 },
    detailsRowLabel: { fontSize: 13, flex: 1 },
    detailsRowValue: { fontSize: 13, fontWeight: '600', flex: 2, textAlign: 'right' },
    detailsName: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
    detailsLine: { fontSize: 14, lineHeight: 20 },
    detailsActions: { gap: 10 },
    detailsEditBtn: { borderWidth: 1, borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center' },
    detailsEditBtnText: { fontSize: 14, fontWeight: '700' },
    detailsPrimaryBtn: { borderWidth: 1, borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center' },
    detailsPrimaryBtnText: { fontSize: 14, fontWeight: '700' },
    detailsPrimaryHint: { fontSize: 13, lineHeight: 18 },
    detailsDeleteBtn: { borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E2' },
    detailsDeleteBtnText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
    detailsCloseBtn: { borderWidth: 1, borderRadius: 12, height: 44, alignItems: 'center', justifyContent: 'center' },
    detailsCloseBtnText: { fontSize: 14, fontWeight: '700' },
});

export default AddressDetailsModal;
