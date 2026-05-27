import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { UserAddress } from '@type/auth';

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
};

const AddressDetailsModal = ({
    address,
    colors,
    displayName,
    isSettingPrimary,
    onClose,
    onEdit,
    onSetPrimary,
}: AddressDetailsModalProps) => {
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
                                    <Text style={[styles.detailsTitle, { color: colors.text }]}>Address Details</Text>
                                    <Text style={[styles.detailsSubtitle, { color: colors.textSecondary }]}>{getAddressTypeLabel(address.address_type)}</Text>
                                </View>
                                {address.is_active ? (
                                    <View style={[styles.primaryBadge, { backgroundColor: colors.primary }]}> 
                                        <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                                    </View>
                                ) : null}
                            </View>

                            <View style={styles.detailsBody}>
                                <Text style={[styles.detailsName, { color: colors.text }]}>{displayName}</Text>
                                <Text style={[styles.detailsLine, { color: colors.textSecondary }]}>{address.address}</Text>
                                <Text style={[styles.detailsLine, { color: colors.textSecondary }]}>{`${address.city}, ${address.state} ${address.zip_code}`}</Text>
                                <Text style={[styles.detailsLine, { color: colors.textSecondary }]}>{address.country}</Text>
                            </View>

                            <View style={styles.detailsActions}>
                                <TouchableOpacity
                                    style={[styles.detailsEditBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                                    onPress={() => onEdit(address)}
                                >
                                    <Text style={[styles.detailsEditBtnText, { color: colors.text }]}>Edit Address</Text>
                                </TouchableOpacity>

                                {!address.is_active ? (
                                    <TouchableOpacity
                                        style={[styles.detailsPrimaryBtn, { borderColor: colors.primary }]}
                                        onPress={() => onSetPrimary(address.id)}
                                        disabled={isSettingPrimary}
                                    >
                                        <Text style={[styles.detailsPrimaryBtnText, { color: colors.primary }]}> 
                                            {isSettingPrimary ? 'Updating...' : 'Set as Primary'}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Text style={[styles.detailsPrimaryHint, { color: colors.textSecondary }]}>This address is your active primary address.</Text>
                                )}

                                <TouchableOpacity
                                    style={[styles.detailsCloseBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                                    onPress={onClose}
                                >
                                    <Text style={[styles.detailsCloseBtnText, { color: colors.text }]}>Close</Text>
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

export default AddressDetailsModal;
