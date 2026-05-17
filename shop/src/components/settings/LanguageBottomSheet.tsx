import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

export const LANGUAGE_OPTIONS = [
    'English (US)',
    'English (UK)',
    'Portuguese',
    'French',
    'Spanish',
] as const;

type LanguageBottomSheetProps = {
    selectedLanguage: string;
    onSelectLanguage: (language: string) => void;
    onClose: () => void;
};

export const LanguageBottomSheet = ({ selectedLanguage, onSelectLanguage, onClose }: LanguageBottomSheetProps) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.sheet, { backgroundColor: colors.background }]}> 
            <View style={[styles.header, { borderBottomColor: colors.border }]}> 
                <Text style={[styles.title, { color: colors.text }]}>Select Language</Text>
                <TouchableOpacity onPress={onClose}>
                    <AppIcon library="Feather" name="x" size={22} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {LANGUAGE_OPTIONS.map((language) => {
                    const selected = selectedLanguage === language;
                    return (
                        <TouchableOpacity
                            key={language}
                            style={[
                                styles.row,
                                {
                                    borderColor: colors.border,
                                    backgroundColor: selected ? colors.primary + '15' : colors.surface,
                                },
                            ]}
                            onPress={() => onSelectLanguage(language)}
                        >
                            <Text style={[styles.rowText, { color: selected ? colors.primary : colors.text }]}>{language}</Text>
                            {selected ? <AppIcon library="Feather" name="check" size={16} color={colors.primary} /> : null}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    sheet: {
        height: '55%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: { fontSize: 16, fontWeight: '800' },
    list: { padding: 20, gap: 10 },
    row: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowText: { fontSize: 14, fontWeight: '600' },
});
