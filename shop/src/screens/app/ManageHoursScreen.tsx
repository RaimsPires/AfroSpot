import React, { useState } from 'react';
import {
    Alert,
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

// --- Mock Data ---
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const INITIAL_SCHEDULE = [
    { day: 'Monday', isOpen: true, openTime: '09:00 AM', closeTime: '06:00 PM' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00 AM', closeTime: '06:00 PM' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00 AM', closeTime: '06:00 PM' },
    { day: 'Thursday', isOpen: true, openTime: '09:00 AM', closeTime: '06:00 PM' },
    { day: 'Friday', isOpen: true, openTime: '09:00 AM', closeTime: '08:00 PM' },
    { day: 'Saturday', isOpen: true, openTime: '10:00 AM', closeTime: '05:00 PM' },
    { day: 'Sunday', isOpen: false, openTime: '', closeTime: '' },
];

export const ManageHoursScreen = ({navigation}:any) => {
    const { colors, isDark } = useTheme();

    // Schedule State
    const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [openTime, setOpenTime] = useState('09:00 AM');
    const [closeTime, setCloseTime] = useState('05:00 PM');

    // --- Handlers ---

    const handleOpenModal = (prefillDay?: string) => {
        if (prefillDay) {
            // Editing a single day
            const dayData = schedule.find((s) => s.day === prefillDay);
            setSelectedDays([prefillDay]);
            if (dayData?.isOpen) {
                setOpenTime(dayData.openTime);
                setCloseTime(dayData.closeTime);
            } else {
                setOpenTime('09:00 AM');
                setCloseTime('05:00 PM');
            }
        } else {
            // Creating a new bulk schedule
            setSelectedDays([]);
            setOpenTime('09:00 AM');
            setCloseTime('05:00 PM');
        }
        setModalVisible(true);
    };

    const toggleDaySelection = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleSaveHours = () => {
        if (selectedDays.length === 0) {
            Alert.alert('Selection Required', 'Please select at least one day to apply these hours.');
            return;
        }
        if (!openTime || !closeTime) {
            Alert.alert('Missing Time', 'Please provide both opening and closing times.');
            return;
        }

        // Update the schedule state for all selected days
        const updatedSchedule = schedule.map((item) => {
            if (selectedDays.includes(item.day)) {
                return { ...item, isOpen: true, openTime, closeTime };
            }
            return item;
        });

        setSchedule(updatedSchedule);
        setModalVisible(false);
    };

    const handleMarkClosed = (day: string) => {
        Alert.alert(
            'Mark as Closed',
            `Are you sure you want to mark ${day} as closed? Customers won't be able to book on this day.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Set Closed',
                    style: 'destructive',
                    onPress: () => {
                        setSchedule(schedule.map(s => s.day === day ? { ...s, isOpen: false, openTime: '', closeTime: '' } : s));
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn}
                onPress={() => navigation.goBack()}
                >
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Operating Hours</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleOpenModal()}>
                    <AppIcon library="Feather" name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* 2. Weekly Schedule List */}
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBox}>
                    <AppIcon library="Feather" name="info" size={16} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                        Tap the + icon to set hours for multiple days at once.
                    </Text>
                </View>

                <View style={[styles.scheduleContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {schedule.map((item, index) => {
                        const isLast = index === schedule.length - 1;
                        return (
                            <View
                                key={item.day}
                                style={[styles.dayRow, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                            >
                                <View style={styles.dayInfo}>
                                    <Text style={[styles.dayName, { color: colors.text }]}>{item.day}</Text>
                                    {item.isOpen ? (
                                        <Text style={[styles.timeText, { color: colors.primary }]}>
                                            {item.openTime} - {item.closeTime}
                                        </Text>
                                    ) : (
                                        <Text style={[styles.closedText, { color: colors.textSecondary }]}>Closed</Text>
                                    )}
                                </View>

                                <View style={styles.actionsRow}>
                                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleOpenModal(item.day)}>
                                        <AppIcon library="Feather" name="edit-2" size={18} color={colors.textSecondary} />
                                    </TouchableOpacity>

                                    {item.isOpen && (
                                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleMarkClosed(item.day)}>
                                            <AppIcon library="Feather" name="trash-2" size={18} color="#EF4444" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* 3. Bulk Add/Edit Modal */}
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

        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    // List
    listContent: { padding: 20, paddingBottom: 60 },
    infoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20, paddingHorizontal: 4 },
    infoText: { fontSize: 13, flex: 1 },

    scheduleContainer: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    dayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
    dayInfo: { flex: 1 },
    dayName: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    timeText: { fontSize: 14, fontWeight: '700' },
    closedText: { fontSize: 14, fontWeight: '600', fontStyle: 'italic' },

    actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    actionBtn: { padding: 8 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', borderWidth: 1, borderBottomWidth: 0 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    closeBtn: { padding: 4 },

    modalBody: { paddingHorizontal: 20, paddingBottom: 20 },

    label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 12, marginTop: 16 },

    // Multi-select Grid
    daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    dayToggleBtn: { width: '22%', paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    dayToggleText: { fontSize: 14, fontWeight: '700' },

    // Time Inputs
    timeInputsRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
    timeInputGroup: { flex: 1 },
    inputWrap: { flexDirection: 'row', alignItems: 'center', height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12 },
    input: { flex: 1, fontSize: 15, fontWeight: '600' },

    modalFooter: { padding: 20, paddingBottom: 34, borderTopWidth: 1 },
    saveBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});