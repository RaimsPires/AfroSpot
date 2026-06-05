import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl // 🚀 Added for pull-to-refresh functionality
    ,







    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { apiClient } from '@services/apiClient';
import { memberService, SpotMemberData, SpotRole } from '@services/memberService';
import StaffEditModal from './staff/StaffEdithModal';
import StaffMemberItem from './staff/StaffMemberItem';

// Unified interface representing either an active member or a pending invitation row
interface UnifiedStaffRow {
    id: string;
    name: string;
    role: string;
    roleKey: SpotRole;
    email: string;
    avatar: string;
    statusLabel: string;
    isInvitation: boolean; // 🚀 Flag to differentiate styling/actions
}

export const ManageStaffScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    const [staffList, setStaffList] = useState<UnifiedStaffRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false); // 🚀 Added state for refresh loader
    const [modalVisible, setModalVisible] = useState(false);
    const [activeEditTarget, setActiveEditTarget] = useState<{ id: number; email: string; role: SpotRole } | null>(null);

    // --- 1. Consolidated Data Query Fetcher ---
    const loadStaffData = async () => {
        try {
            // Fetch both active members and pending invitations over the network simultaneously
            const [membersResponse, invitesResponse] = await Promise.all([
                apiClient.get<SpotMemberData[]>('/spots/members/'),
                memberService.getPendingInvitations()
            ]);

            // Map accepted/active members
            const acceptedMembers: UnifiedStaffRow[] = membersResponse.data.map(member => ({
                id: `member-${member.id}`,
                name: `${member.user.first_name} ${member.user.last_name}`.trim() || member.user.email,
                role: member.role_display,
                roleKey: member.role,
                email: member.user.email,
                avatar: member.user.profile_picture || 'https://i.pravatar.cc/150?img=68',
                statusLabel: 'Active',
                isInvitation: false
            }));

            // Map unaccepted staging invitations
            const pendingInvites: UnifiedStaffRow[] = invitesResponse.map(invite => ({
                id: `invite-${invite.id}`,
                name: invite.email.split('@')[0], // Fallback name display out of email handle string
                role: invite.role.charAt(0).toUpperCase() + invite.role.slice(1),
                roleKey: invite.role,
                email: invite.email,
                avatar: 'https://i.pravatar.cc/150?img=66', // Staging/invited user grey placeholder avatar
                statusLabel: 'Pending Invite', // 🚀 Label used for display
                isInvitation: true
            }));

            // Merge arrays cleanly (putting pending invitations at the top)
            setStaffList([...pendingInvites, ...acceptedMembers]);
        } catch (err) {
            console.log(err);

            Alert.alert("Sync Error", "Could not synchronize operational personnel rosters.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadStaffData();
    }, []);

    // --- 2. Pull To Refresh Handler Hook ---
    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        loadStaffData();
    }, []);

    // --- 3. Interaction Handlers ---
    const openAddModal = () => {
        setActiveEditTarget(null);
        setModalVisible(true);
    };

    const openEditModal = (row: UnifiedStaffRow) => {
        if (row.isInvitation) {
            Alert.alert("Pending Invitation", "This user hasn't created their account or accepted the invitation yet. You cannot update their role until they join.");
            return;
        }

        // Extract raw numeric primary key out of string prefix map
        const numericalId = parseInt(row.id.replace('member-', ''), 10);
        setActiveEditTarget({
            id: numericalId,
            email: row.email,
            role: row.roleKey,
        });
        setModalVisible(true);
    };

    const handleSaveAction = async (email: string, role: SpotRole) => {
        if (activeEditTarget) {
            await memberService.updateMemberRole(activeEditTarget.id, role);
        } else {
            await memberService.addMember(email, role);
        }
    };

const handleDelete = (row: UnifiedStaffRow) => {
    console.log(row.id);
    
    const title = row.isInvitation ? 'Cancel Invitation' : 'Remove Staff';
    const msg = row.isInvitation 
        ? `Are you sure you want to revoke the pending invitation sent to ${row.email}?`
        : `Are you sure you want to remove ${row.name}?`;

    Alert.alert(title, msg, [
        { text: 'Cancel', style: 'cancel' },
        { 
            text: row.isInvitation ? 'Revoke' : 'Remove', 
            style: 'destructive', 
            onPress: async () => {
                try {
                    // Extract the raw numerical ID from your front-end display list prefix wrapper
                    const numericId = row.id.replace(row.isInvitation ? 'invite-' : 'member-', '');

                    if (row.isInvitation) {
                        // 🚀 Use the new clean, explicit service method
                        await memberService.revokeInvitation(numericId);
                    } else {
                        await memberService.removeMember(numericId);
                    }

                    // Optimistically remove row item context state visually
                    setStaffList(prev => prev.filter(item => item.id !== row.id));
                } catch (err) {
                    console.log(err);
                    
                    Alert.alert("Error", "Could not complete action request. Please verify network paths.");
                }
            } 
        },
    ]);
};

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header Navbar Block */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Staff</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={openAddModal}>
                    <AppIcon library="Feather" name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {isLoading && !isRefreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    // 🚀 Added pull to refresh control layout matrix configuration parameters
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]} // Android Theme Colorization
                            tintColor={colors.primary} // iOS Theme Colorization
                        />
                    }
                >
                    {staffList.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No team records or invitations found.</Text>
                        </View>
                    ) : (
                        staffList.map((row) => (
                            <StaffMemberItem
                                key={row.id}
                                member={{
                                    id: row.id,
                                    name: row.name,
                                    role: row.role,
                                    email: row.email,
                                    avatar: row.avatar,
                                    // Pass custom labels styling indicators over into layout components
                                    status: row.statusLabel
                                }}
                                handleDelete={() => handleDelete(row)}
                                openEditModal={() => openEditModal(row)}
                            />
                        ))
                    )}
                </ScrollView>
            )}

            <StaffEditModal
                modalVisible={modalVisible}
                editingMember={activeEditTarget}
                closeModal={() => {
                    setModalVisible(false);
                    setActiveEditTarget(null);
                }}
                handleSaveAction={handleSaveAction}
                onSaveSuccess={() => {
                    loadStaffData();
                }}
            />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 4 },
    listContent: { padding: 20, gap: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 14, textAlign: 'center', fontWeight: '500' },
});