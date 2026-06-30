import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { UserAddress } from '@type/auth';
import { useTranslation } from 'react-i18next';

import { getAddressIcon, getAddressTypeLabel } from './addressUtils';

type AddressCardColors = {
    surface: string;
    border: string;
    primary: string;
    text: string;
    textSecondary: string;
};

type AddressCardProps = {
    item: UserAddress;
    colors: AddressCardColors;
    displayName: string;
    isSettingPrimary: boolean;
    onEdit: (address: UserAddress) => void;
    onSelect: (addressId: string) => void;
    onSetPrimary: (addressId: string) => void;
    onDelete: (address: UserAddress) => void;
};

const AddressCard = ({
    item,
    colors,
    displayName,
    isSettingPrimary,
    onEdit,
    onSelect,
    onSetPrimary,
    onDelete,
}: AddressCardProps) => {
    const { t } = useTranslation();

    return (
        <View style={[styles.addressCard, { backgroundColor: colors.surface, borderColor: item.is_active ? colors.primary : colors.border }]}>
            <View style={styles.cardHeader}>
                <View style={styles.labelRow}>
                    <View style={[styles.iconBg, { backgroundColor: `${colors.primary}15` }]}>
                        <AppIcon library="Feather" name={getAddressIcon(item.address_type)} size={16} color={colors.primary} />
                    </View>
                    <Text style={[styles.labelText, { color: colors.text }]}>{t(`addresses.labels.${getAddressTypeLabel(item.address_type).toLowerCase()}`)}</Text>
                    {item.is_active ? (
                        <View style={[styles.primaryBadge, { backgroundColor: colors.primary }]}> 
                            <Text style={styles.primaryBadgeText}>{t('addresses.badges.primary')}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={styles.actionIcons}>
                    <TouchableOpacity style={styles.iconBtnSmall} onPress={() => onEdit(item)}>
                        <AppIcon library="Feather" name="edit-2" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                    {!item.is_active ? (
                        <TouchableOpacity style={styles.iconBtnSmall} onPress={() => onDelete(item)}>
                            <AppIcon library="Feather" name="trash-2" size={16} color="#EF4444" />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            <TouchableOpacity
                style={styles.cardBody}
                onPress={() => onSelect(item.id)}
                activeOpacity={0.8}
            >
                <Text style={[styles.nameText, { color: colors.text }]}>{displayName}</Text>
                <Text style={[styles.addressText, { color: colors.textSecondary }]}>{item.address}</Text>
                <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                    {`${item.city}, ${item.state} ${item.zip_code}`}
                </Text>
                <Text style={[styles.addressText, { color: colors.textSecondary }]}>{item.country}</Text>
            </TouchableOpacity>

            {!item.is_active ? (
                <TouchableOpacity
                    style={[styles.setPrimaryBtn, { borderTopColor: colors.border }]}
                    onPress={() => onSetPrimary(item.id)}
                    disabled={isSettingPrimary}
                >
                    <Text style={[styles.setPrimaryText, { color: colors.primary }]}> 
                        {isSettingPrimary ? t('addresses.actions.updating') : t('addresses.actions.setAsPrimary')}
                    </Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
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

export default AddressCard;