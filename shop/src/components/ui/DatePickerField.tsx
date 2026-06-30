import React, { useEffect, useMemo, useState } from 'react';
import {
    Modal,
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

import { useTheme } from '@contexts/ThemeContext';
import { useTranslation } from '@contexts/TranslationContext';
import AppIcon from './AppIcon';

export interface DatePickerFieldProps {
    label?: string;
    value: Date | null;
    onChange: (date: Date) => void;
    placeholder?: string;
    minimumDate?: Date;
    maximumDate?: Date;
    helperText?: string;
    dateContainer?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    // 🚀 New prop to control the presentation style
    variant?: 'modal' | 'bottomSheet'; 
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
    containerStyle,
    labelStyle,
    dateContainer,
    variant = 'bottomSheet', // Defaulting to bottomSheet for a modern feel
}: DatePickerFieldProps) => {
    const { colors, spacing, isDark } = useTheme();
    const [open, setOpen] = useState(false);
    const [activeDate, setActiveDate] = useState(value ?? new Date());

    const { language } = useTranslation();

    const displayValue = useMemo(() => (value ? formatDate(value) : ''), [value]);

    useEffect(() => {
        if (value) {
            setActiveDate(value);
        }
    }, [value]);

    const handleDone = () => {
        onChange(activeDate);
        setOpen(false);
    };

    const isBottomSheet = variant === 'bottomSheet';

    return (
        <View style={[styles.container, { gap: spacing(1) }, dateContainer]}>
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
                    containerStyle
                ]}
            >
                <Text style={[styles.value, { color: value ? colors.text : colors.textSecondary }, labelStyle]}>
                    {displayValue || placeholder}
                </Text>
                <AppIcon library="Feather" name="calendar" size={18} color={colors.textSecondary} />
            </Pressable>

            {helperText ? <Text style={[styles.helper, { color: colors.textSecondary }]}>{helperText}</Text> : null}

            <Modal 
                transparent 
                visible={open} 
                animationType={isBottomSheet ? "slide" : "fade"} 
                onRequestClose={() => setOpen(false)}
            >
                <Pressable 
                    style={[styles.backdrop, isBottomSheet ? styles.backdropBottom : styles.backdropCenter]} 
                    onPress={() => setOpen(false)}
                >
                    <Pressable 
                        style={[
                            isBottomSheet ? styles.sheetBottom : styles.sheetModal, 
                            { backgroundColor: colors.surface }
                        ]} 
                        onPress={() => undefined} // Prevent clicks from bubbling to backdrop
                    >
                        {/* Handle bar for bottom sheet UX */}
                        {isBottomSheet && (
                            <View style={styles.handleBarWrap}>
                                <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
                            </View>
                        )}

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
                                locale={language}
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
    
    // Backdrop configurations
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    backdropCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdropBottom: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    // Modal Variant Styles
    sheetModal: {
        width: '92%',
        maxWidth: 420,
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },

    // Bottom Sheet Variant Styles
    sheetBottom: {
        width: '100%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24, // Safe area padding
    },

    // Universal Inner Styles
    handleBarWrap: {
        alignItems: 'center',
        marginBottom: 12,
    },
    handleBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    picker: {
        alignSelf: 'center',
    },
});

export default DatePickerField;