import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RenderWeeklyScheduleList:React.FC<{schedule: any[],handleOpenModal:(day?: string) => void , handleMarkClosed:(day: string) => void}> = ({schedule, handleOpenModal, handleMarkClosed}) => {
    const { colors } = useTheme();
    return (
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
    )
}

export default RenderWeeklyScheduleList

const styles = StyleSheet.create({
   

    scheduleContainer: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    dayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
    dayInfo: { flex: 1 },
    dayName: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    timeText: { fontSize: 14, fontWeight: '700' },
    closedText: { fontSize: 14, fontWeight: '600', fontStyle: 'italic' },

    actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    actionBtn: { padding: 8 },
})