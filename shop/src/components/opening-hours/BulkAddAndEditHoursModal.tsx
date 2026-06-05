import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const BulkAddAndEditHoursModal: React.FC<{ modalVisible: boolean, selectedDays: string[], openTime: string, closeTime: string, setOpenTime: (time: string) => void, setCloseTime: (time: string) => void, handleSaveHours: () => Promise<void>, toggleDaySelection: (day: string) => void, setModalVisible: (visible: boolean) => void ,  }> = ({ modalVisible, selectedDays, openTime, closeTime, setOpenTime, setCloseTime, toggleDaySelection, setModalVisible,handleSaveHours }) => {
    const { colors } = useTheme();
    const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (
        <Modal visible={modalVisible} transparent animationType="slide">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.background, borderTopColor: colors.border }]}>

                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Set Operating Hours</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                            <AppIcon library="Feather" name="x" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalBody}>

                        {/* Select Days Multi-Toggle */}
                        <Text style={[styles.label, { color: colors.textSecondary }]}>APPLY TO DAYS</Text>
                        <View style={styles.daysGrid}>
                            {DAYS_OF_WEEK.map((day, i) => {
                                const isSelected = selectedDays.includes(day);
                                return (
                                    <TouchableOpacity
                                        key={day}
                                        onPress={() => toggleDaySelection(day)}
                                        style={[
                                            styles.dayToggleBtn,
                                            {
                                                backgroundColor: isSelected ? colors.primary : colors.surface,
                                                borderColor: isSelected ? colors.primary : colors.border,
                                            }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.dayToggleText,
                                            { color: isSelected ? '#FFF' : colors.text }
                                        ]}>
                                            {SHORT_DAYS[i]}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Time Inputs */}
                        <View style={styles.timeInputsRow}>
                            <View style={styles.timeInputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>OPENING TIME</Text>
                                <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <AppIcon library="Feather" name="sun" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        value={openTime}
                                        onChangeText={setOpenTime}
                                        placeholder="e.g. 09:00 AM"
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                </View>
                            </View>

                            <View style={styles.timeInputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>CLOSING TIME</Text>
                                <View style={[styles.inputWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <AppIcon library="Feather" name="moon" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        value={closeTime}
                                        onChangeText={setCloseTime}
                                        placeholder="e.g. 05:00 PM"
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                </View>
                            </View>
                        </View>

                    </ScrollView>

                    <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                        <TouchableOpacity
                            style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: selectedDays.length === 0 ? 0.5 : 1 }]}
                            onPress={handleSaveHours}
                        >
                            <Text style={styles.saveBtnText}>Apply Hours</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default BulkAddAndEditHoursModal

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', borderWidth: 1, borderBottomWidth: 0 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    closeBtn: { padding: 4 },

    modalBody: { paddingHorizontal: 20, paddingBottom: 20 },

    label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 12, marginTop: 16 },
    modalFooter: { padding: 20, paddingBottom: 34, borderTopWidth: 1 },
    saveBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

    daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    dayToggleBtn: { width: '22%', paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    dayToggleText: { fontSize: 14, fontWeight: '700' },
    timeInputsRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
    timeInputGroup: { flex: 1 },
    inputWrap: { flexDirection: 'row', alignItems: 'center', height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12 },
    input: { flex: 1, fontSize: 15, fontWeight: '600' },
})