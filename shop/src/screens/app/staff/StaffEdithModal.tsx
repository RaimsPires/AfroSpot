import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { SpotRole } from '@services/memberService';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

// Role layout rendering dictionary matrix
const AVAILABLE_ROLES: { label: string; value: SpotRole }[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'Staff', value: 'staff' },
];

interface StaffEditModalProps {
    modalVisible: boolean;
    closeModal: () => void;
    /** If provided, we are editing an existing member instance */
    editingMember: { id: number; email: string; role: SpotRole } | null;
    /** Triggers on a successful save action */
    onSaveSuccess: () => void;
    /** Async processing connection handler */
    handleSaveAction: (email: string, role: SpotRole) => Promise<void>;
}

const StaffEditModal: React.FC<StaffEditModalProps> = ({
    modalVisible,
    closeModal,
    editingMember,
    handleSaveAction,
    onSaveSuccess
}) => {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<SpotRole>('staff');
    const [isSaving, setIsSaving] = useState(false);

    // Sync input parameters whenever targets change
    useEffect(() => {
        if (editingMember) {
            setEmail(editingMember.email);
            setRole(editingMember.role);
        } else {
            setEmail('');
            setRole('staff');
        }
    }, [editingMember, modalVisible]);

    const onSave = async () => {
        if (!email.trim()) return;
        setIsSaving(true);
        try {
            await handleSaveAction(email, role);
            onSaveSuccess();
            closeModal();
        } catch (error:any) {
            console.log(error.response.data);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>

                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {editingMember ? 'Edit Staff Role' : 'Add Staff Member'}
                            </Text>
                            <TouchableOpacity 
                            onPress={closeModal}
                                // hapticFeedbackEnabled={false}
                            >
                                <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
                            <Text style={[styles.label, { color: colors.textSecondary }]}>EMAIL ADDRESS</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { borderColor: colors.border, color: colors.text, backgroundColor: editingMember ? colors.surface : 'transparent' }
                                ]}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!editingMember} // Email addresses are unmodifiable during standard permission updates
                                placeholder="staff@afrospot.com"
                                placeholderTextColor={colors.textSecondary}
                            />

                            <Text style={[styles.label, { color: colors.textSecondary }]}>BUSINESS ROLE ASSIGNMENT</Text>
                            <View style={styles.roleChipRow}>
                                {AVAILABLE_ROLES.map((item) => {
                                    const isSelected = role === item.value;
                                    return (
                                        <TouchableOpacity
                                            key={item.value}
                                            onPress={() => setRole(item.value)}
                                            style={[
                                                styles.roleChip,
                                                {
                                                    backgroundColor: isSelected ? colors.primary : colors.surface,
                                                    borderColor: isSelected ? colors.primary : colors.border,
                                                },
                                            ]}
                                        >
                                            <Text style={{ color: isSelected ? '#FFF' : colors.text, fontWeight: '700', fontSize: 13 }}>
                                                {item.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <TouchableOpacity
                                style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: isSaving ? 0.7 : 1 }]}
                                onPress={onSave}
                                disabled={isSaving || !email.trim()}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.saveBtnText}>
                                        {editingMember ? 'Update Scope Details' : 'Confirm Registration Invitation'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default StaffEditModal;

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: '900' },
    modalBody: { padding: 20 },
    label: { fontSize: 11, fontWeight: '800', marginBottom: 10, marginTop: 16, letterSpacing: 0.5 },
    input: { height: 52, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    roleChipRow: { flexDirection: 'row', gap: 10, marginTop: 4, flexWrap: 'wrap' },
    roleChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    saveBtn: { height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 36 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});