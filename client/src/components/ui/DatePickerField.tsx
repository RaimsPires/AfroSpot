import React, { useMemo, useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

import { useTheme } from '../../contexts/ThemeContext';
import AppIcon from './AppIcon';

export interface DatePickerFieldProps {
    label?: string;
    value: Date | null;
    onChange: (date: Date) => void;
    placeholder?: string;
    minimumDate?: Date;
    maximumDate?: Date;
    helperText?: string;
}

const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);

const DatePickerField = ({
    label = 'Date of Birth',
    value,
    onChange,
    placeholder = 'Select your date of birth',
    minimumDate,
    maximumDate,
    helperText,
}: DatePickerFieldProps) => {
    const { colors, spacing, isDark } = useTheme();
    const [open, setOpen] = useState(false);
    const [activeDate, setActiveDate] = useState(value ?? new Date());

    const displayValue = useMemo(() => (value ? formatDate(value) : ''), [value]);

    React.useEffect(() => {
        if (value) {
            setActiveDate(value);
        }
    }, [value]);

    const handleDone = () => {
        onChange(activeDate);
        setOpen(false);
    };

    return (
        <View style={[styles.container, { gap: spacing(1) }]}>
            {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}

            <Pressable
                onPress={() => {
                    setActiveDate(value ?? new Date());
                    setOpen(true);
                }}
                style={[
                    styles.field,
                    {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        paddingHorizontal: spacing(1.5),
                    },
                ]}
            >
                <Text style={[styles.value, { color: value ? colors.text : colors.textSecondary }]}>
                    {displayValue || placeholder}
                </Text>
                <AppIcon library="Feather" name="calendar" size={18} color={colors.textSecondary} />
            </Pressable>

            {helperText ? <Text style={[styles.helper, { color: colors.textSecondary }]}>{helperText}</Text> : null}

            <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
                <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
                    <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={() => undefined}>
                        <View style={styles.sheetHeader}>
                            <Pressable onPress={() => setOpen(false)} hitSlop={10}>
                                <Text style={[styles.sheetAction, { color: colors.textSecondary }]}>Cancel</Text>
                            </Pressable>
                            <Text style={[styles.sheetTitle, { color: colors.text }]}>{label}</Text>
                            <Pressable onPress={handleDone} hitSlop={10}>
                                <Text style={[styles.sheetAction, { color: colors.primary }]}>Done</Text>
                            </Pressable>
                        </View>

                        <View style={styles.pickerWrap}>
                            <DatePicker
                                date={activeDate}
                                mode="date"
                                minimumDate={minimumDate}
                                maximumDate={maximumDate}
                                onDateChange={setActiveDate}
                                modal={false}
                                theme={isDark ? 'dark' : 'light'}
                                style={styles.picker}
                            />
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    field: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    value: {
        flex: 1,
        fontSize: 15,
    },
    helper: {
        fontSize: 12,
        marginTop: 2,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sheet: {
        width: '92%',
        maxWidth: 420,
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sheetTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    sheetAction: {
        fontSize: 14,
        fontWeight: '600',
    },
    pickerWrap: {
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    picker: {
        alignSelf: 'center',
    },
});

export default DatePickerField;