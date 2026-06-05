import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StaffMemberItemProps {
    member: {
        id: string;
        name: string;
        role: string;
        email: string;
        avatar: string;
        status: string;
    };
    openEditModal: (member: any) => void;
    handleDelete: (member: any) => void;
}

const StaffMemberItem: React.FC<StaffMemberItemProps> = ({ member, openEditModal, handleDelete }) => {
    const { colors , isDark} = useTheme()
    const isPending = member.status === 'Pending Invite';

    return (
        <View style={[styles.staffCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            
            {/* 1. Avatar Container */}
            <Image source={{ uri: member.avatar }} style={styles.avatar} />
            
            {/* 2. Core Operational Metadata Information Column */}
            <View style={styles.infoCol}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                    {member.name}
                </Text>
                <Text style={[styles.role, { color: colors.primary }]} numberOfLines={1}>
                    {member.role}
                </Text>
                
                <View style={styles.contactRow}>
                    <AppIcon library="Feather" name="mail" size={13} color={colors.textSecondary} />
                    <Text style={[styles.contactText, { color: colors.textSecondary }]} numberOfLines={1}>
                        {member.email}
                    </Text>
                </View>
            </View>
            
            {/* 3. Operational Badges & Action CTA Matrices Column */}
            <View style={styles.actionsCol}>
                
                {/* Custom Micro-Status Pill Badge */}
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: isPending ? 'rgba(234, 179, 8, 0.08)' : 'rgba(16, 185, 129, 0.08)' }
                ]}>
                    <View style={[
                        styles.statusDot, 
                        { backgroundColor: isPending ? '#EAB308' : '#10B981' }
                    ]} />
                    <Text style={[
                        styles.statusText,
                        { color: isPending ? '#EAB308' : '#10B981' }
                    ]}>
                        {isPending ? 'Pending' : 'Active'}
                    </Text>
                </View>

                {/* Button Interaction Trigger Matrix Row */}
                <View style={styles.btnRow}>
                    <TouchableOpacity 
                        style={[
                            styles.actionBtn, 
                            { borderColor: colors.border, backgroundColor: colors.background },
                            isPending && styles.disabledBtn // Dim look if it is a pending invite
                        ]} 
                        onPress={() => openEditModal(member)} // 🚀 Passes the whole object context safely
                        activeOpacity={0.7}
                    >
                        <AppIcon 
                            library="Feather" 
                            name="edit-2" 
                            size={14} 
                            color={isPending ? colors.textMuted : colors.textSecondary} 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.actionBtn, 
                            { borderColor: colors.border, backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2' }
                        ]} 
                        onPress={() => handleDelete(member)} // 🚀 Pass whole object down so parent can show context in the alert
                        activeOpacity={0.7}
                    >
                        <AppIcon library="Feather" name="trash-2" size={14} color="#EF4444" />
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    )
}

export default StaffMemberItem

const styles = StyleSheet.create({
    staffCard: { 
        flexDirection: 'row', 
        padding: 16, 
        borderRadius: 20, 
        borderWidth: 1, 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
    },
    avatar: { 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        marginRight: 14,
        backgroundColor: '#F3F4F6'
    },
    infoCol: { 
        flex: 1,
        paddingRight: 8
    },
    name: { 
        fontSize: 16, 
        fontWeight: '900', 
        marginBottom: 2,
        letterSpacing: -0.2
    },
    role: { 
        fontSize: 13, 
        fontWeight: '700', 
        marginBottom: 8,
        letterSpacing: 0.1
    },
    contactRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 6 
    },
    contactText: { 
        fontSize: 12,
        fontWeight: '500',
        flex: 1
    },
    actionsCol: { 
        alignItems: 'flex-end',
        gap: 10,
        justifyContent: 'center'
    },
    btnRow: { 
        flexDirection: 'row', 
        gap: 8 
    },
    actionBtn: { 
        width: 36, 
        height: 36, 
        borderRadius: 12, 
        borderWidth: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    disabledBtn: {
        opacity: 0.5
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 5
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3
    },
    statusText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.4
    }
})