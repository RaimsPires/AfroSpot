import React from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { AppIcon } from '@components/ui';

import { LANGUAGES } from './mockData';

type LanguageBottomSheetProps = {
    visible: boolean;
    onClose: () => void;
    onSelectLanguage: (languageId: string) => void;
    currentLanguage: string;
    colors: {
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        primary: string;
        border: string;
    };
};

const LanguageBottomSheet = ({
    visible,
    onClose,
    onSelectLanguage,
    currentLanguage,
    colors,
}: LanguageBottomSheetProps) => {
    const handleSelectLanguage = (languageId: string) => {
        onSelectLanguage(languageId);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={[styles.bottomSheet, { backgroundColor: colors.surface }]}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.handle} />

                    <Text style={[styles.title, { color: colors.text }]}>Select Language</Text>

                    <ScrollView
                        scrollEnabled={LANGUAGES.length > 6}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.languageList}
                    >
                        {LANGUAGES.map((language, index) => (
                            <TouchableOpacity
                                key={language.id}
                                onPress={() => handleSelectLanguage(language.id)}
                                style={[
                                    styles.languageItem,
                                    {
                                        backgroundColor: currentLanguage === language.id
                                            ? colors.primary + '15'
                                            : 'transparent',
                                        borderColor: colors.border,
                                    },
                                    index !== LANGUAGES.length - 1 && { borderBottomWidth: 1 },
                                ]}
                            >
                                <Text style={styles.flag}>{language.flag}</Text>
                                <Text style={[styles.languageName, { color: colors.text }]}>
                                    {language.name}
                                </Text>
                                {currentLanguage === language.id && (
                                    <AppIcon
                                        library="AntDesign"
                                        name="check"
                                        size={20}
                                        color={colors.primary}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.closeBtn, { backgroundColor: colors.primary }]}
                        onPress={onClose}
                    >
                        <Text style={styles.closeBtnText}>Done</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 32,
        paddingHorizontal: 20,
        maxHeight: '80%',
    },
    handle: {
        width: 48,
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 2,
        alignSelf: 'center',
        marginVertical: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 16,
        marginTop: 8,
    },
    languageList: {
        paddingVertical: 8,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    flag: {
        fontSize: 24,
        marginRight: 12,
    },
    languageName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    closeBtn: {
        marginTop: 16,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
});

export default LanguageBottomSheet;
