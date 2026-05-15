import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const INITIAL_STAFF = [
    { id: '1', name: 'Kwame O.', role: 'Master Barber', email: 'kwame@kushitecutz.com', phone: '555-0101', avatar: 'https://i.pravatar.cc/150?img=11', status: 'Active' },
    { id: '2', name: 'Amara J.', role: 'Braiding Expert', email: 'amara@kushitecutz.com', phone: '555-0102', avatar: 'https://i.pravatar.cc/150?img=47', status: 'On Leave' },
    { id: '3', name: 'Malik T.', role: 'Senior Stylist', email: 'malik@kushitecutz.com', phone: '555-0103', avatar: 'https://i.pravatar.cc/150?img=8', status: 'Active' },
];

export const ManageStaffScreen = () => {
    const { colors, isDark } = useTheme();

    const [staff, setStaff] = useState(INITIAL_STAFF);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const openAddModal = () => {
        setEditingId(null);
        setName(''); setRole(''); setEmail(''); setPhone('');
        setModalVisible(true);
    };

    const openEditModal = (member: any) => {
        setEditingId(member.id);
        setName(member.name); setRole(member.role); setEmail(member.email); setPhone(member.phone);
        setModalVisible(true);
    };

    const handleDelete = (id: string) => {
        Alert.alert('Remove Staff', 'Are you sure you want to remove this staff member? This will reassign their upcoming bookings.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => setStaff(staff.filter(s => s.id !== id)) },
        ]);
    };

    const handleSave = () => {
        if (!name || !role) {
            Alert.alert('Missing Fields', 'Name and Role are required.');
            return;
        }
        const newMember = {
            id: editingId || Date.now().toString(),
            name, role, email, phone,
            avatar: 'https://i.pravatar.cc/150?img=68', // Placeholder for new staff
            status: 'Active',
        };

        if (editingId) {
            setStaff(staff.map(s => (s.id === editingId ? { ...s, ...newMember } : s)));
        } else {
            setStaff([...staff, newMember]);
        }
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}><AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Staff</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={openAddModal}>
                    <AppIcon library="Feather" name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {staff.map((member) => (
                    <View key={member.id} style={[styles.staffCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Image source={{ uri: member.avatar }} style={styles.avatar} />
                        <View style={styles.infoCol}>
                            <Text style={[styles.name, { color: colors.text }]}>{member.name}</Text>
                            <Text style={[styles.role, { color: colors.primary }]}>{member.role}</Text>
                            <View style={styles.contactRow}>
                                <AppIcon library="Feather" name="mail" size={12} color={colors.textSecondary} />
                                <Text style={[styles.contactText, { color: colors.textSecondary }]}>{member.email}</Text>
                            </View>
                        </View>
                        <View style={styles.actionsCol}>
                            <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.border }]} onPress={() => openEditModal(member)}>
                                <AppIcon library="Feather" name="edit-2" size={16} color={colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.border, backgroundColor: colors.destructiveSurface }]} onPress={() => handleDelete(member.id)}>
                                <AppIcon library="Feather" name="trash-2" size={16} color={colors.destructive} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Add/Edit Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>{editingId ? 'Edit Staff' : 'Add Staff'}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><AppIcon library="Feather" name="x" size={24} color={colors.text} /></TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.modalBody}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>FULL NAME</Text>
                            <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} value={name} onChangeText={setName} placeholder="John Doe" placeholderTextColor={colors.textSecondary} />

                            <Text style={[styles.label, { color: colors.textSecondary }]}>ROLE / TITLE</Text>
                            <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} value={role} onChangeText={setRole} placeholder="e.g. Senior Barber" placeholderTextColor={colors.textSecondary} />

                            <Text style={[styles.label, { color: colors.textSecondary }]}>EMAIL</Text>
                            <TextInput style={[styles.input, { borderColor: colors.border, color: colors.text }]} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="john@example.com" placeholderTextColor={colors.textSecondary} />

                            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
                                <Text style={styles.saveBtnText}>Save Staff Member</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 4 },
    listContent: { padding: 20, gap: 16 },
    staffCard: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
    avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16 },
    infoCol: { flex: 1 },
    name: { fontSize: 16, fontWeight: '800', marginBottom: 2 },
    role: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
    contactRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    contactText: { fontSize: 12 },
    actionsCol: { flexDirection: 'row', gap: 8 },
    actionBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
    modalTitle: { fontSize: 18, fontWeight: '800' },
    modalBody: { padding: 20 },
    label: { fontSize: 11, fontWeight: '800', marginBottom: 8, marginTop: 16 },
    input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16 },
    saveBtn: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 32 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});