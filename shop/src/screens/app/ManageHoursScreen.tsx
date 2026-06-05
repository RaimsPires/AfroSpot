import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BulkAddAndEditHoursModal from '@components/opening-hours/BulkAddAndEditHoursModal';
import OpeningHoursHeader from '@components/opening-hours/OpeningHoursHeader';
import RenderWeeklyScheduleList from '@components/opening-hours/RenderWeeklyScheduleList';
import { AppIcon, ConfirmationModal } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { hoursService } from '@services/hoursService';

const INITIAL_SCHEDULE = [
    { day: 'Monday', isOpen: true, openTime: '09:00 AM', closeTime: '06:00 PM' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00 AM', closeTime: '06:00 PM' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00 AM', closeTime: '06:00 PM' },
    { day: 'Thursday', isOpen: true, openTime: '09:00 AM', closeTime: '06:00 PM' },
    { day: 'Friday', isOpen: true, openTime: '09:00 AM', closeTime: '08:00 PM' },
    { day: 'Saturday', isOpen: true, openTime: '10:00 AM', closeTime: '05:00 PM' },
    { day: 'Sunday', isOpen: false, openTime: '', closeTime: '' },
];

export const ManageHoursScreen = () => {
    const { colors, isDark } = useTheme();
    // const { active_spot } = useAuth()

    // Schedule State
    const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
    // const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [openTime, setOpenTime] = useState('09:00 AM');
    const [closeTime, setCloseTime] = useState('05:00 PM');

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteModalDay, setDeleteModalDay] = useState<string | null>(null);

    // 1. Initial Fetch Mount Hook
    useEffect(() => {
        const loadData = async () => {
            try {
                const serverSchedule = await hoursService.fetchHours();
                setSchedule(serverSchedule);
            } catch (err) {
                console.log(err);
                setModalVisible(true)
                Alert.alert("Error", "Could not fetch active business operating hours.");
            } finally {
                // setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // 2. Updated Bulk/Single Save Handler Action
    const handleSaveHours = async () => {
        if (selectedDays.length === 0) {
            Alert.alert('Selection Required', 'Please select at least one day.');
            return;
        }
        if (!openTime || !closeTime) {
            Alert.alert('Missing Time', 'Please provide opening and closing times.');
            return;
        }

        try {
            // Send updates directly to the server
            await hoursService.saveHours(selectedDays, true, openTime, closeTime);

            // Synchronize local component state seamlessly on success
            const updatedSchedule = schedule.map((item) => {
                if (selectedDays.includes(item.day)) {
                    return { ...item, isOpen: true, openTime, closeTime };
                }
                return item;
            });
            setSchedule(updatedSchedule);
            setModalVisible(false);
        } catch {

            Alert.alert("Save Failed", "Could not synchronize hours with the server.");
        }
    };


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

    // 3. Updated Close Handler Confirmation Action
    const handleConfirmMarkClosed = async () => {
        if (!deleteModalDay) return;

        try {
            // Pass payload with false isOpen flag
            await hoursService.saveHours([deleteModalDay], false, '', '');

            // Update local component state
            setSchedule(schedule.map(s => s.day === deleteModalDay ? { ...s, isOpen: false, openTime: '', closeTime: '' } : s));
            setDeleteModalVisible(false);
        } catch (err) {
            console.log(err);

            Alert.alert("Update Failed", "Could not process closing update parameter.");
        }
    };


    const toggleDaySelection = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };


    const handleMarkClosed = (day: string) => {
        setDeleteModalDay(day)
        setDeleteModalVisible(true)
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <OpeningHoursHeader
                handleOpenModal={handleOpenModal}
            />
            <ConfirmationModal
                visible={deleteModalVisible}
                title='Mark as Closed'
                variant="danger"
                message={`Are you sure you want to mark ${deleteModalDay} as closed? Customers won't be able to book on this day.`}
                onConfirm={handleConfirmMarkClosed}
                onCancel={() => {
                    setDeleteModalDay(null)
                    setDeleteModalVisible(false)
                }}

            />

            {/* 2. Weekly Schedule List */}
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBox}>
                    <AppIcon library="Feather" name="info" size={16} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                        Tap the + icon to set hours for multiple days at once.
                    </Text>
                </View>

                <RenderWeeklyScheduleList
                    handleMarkClosed={handleMarkClosed}
                    handleOpenModal={handleOpenModal}
                    schedule={schedule}
                />
            </ScrollView>

            {/* 3. Bulk Add/Edit Modal */}
            <BulkAddAndEditHoursModal
                modalVisible={modalVisible}
                selectedDays={selectedDays}
                toggleDaySelection={toggleDaySelection}
                setModalVisible={setModalVisible}
                openTime={openTime}
                closeTime={closeTime}
                setOpenTime={setOpenTime}
                setCloseTime={setCloseTime}
                handleSaveHours={handleSaveHours}
            />

        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContent: { padding: 20, paddingBottom: 60 },
    infoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20, paddingHorizontal: 4 },
    infoText: { fontSize: 13, flex: 1 },
});