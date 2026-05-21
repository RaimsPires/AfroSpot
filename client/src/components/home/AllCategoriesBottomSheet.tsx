import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CategoryItem, CategoryItemProps } from './CategoryItem';

type AllCategoriesBottomSheetProps = {
    visible: boolean;
    onClose: () => void;
    categories: CategoryItemProps[];
    onCategoryPress?: (category: CategoryItemProps) => void;
};

export const AllCategoriesBottomSheet = ({
    visible,
    onClose,
    categories,
    onCategoryPress,
}: AllCategoriesBottomSheetProps) => {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.overlayTouch} onPress={onClose} activeOpacity={1} />
                <View style={[styles.bottomSheet, { backgroundColor: colors.background }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>All Categories</Text>
                        <TouchableOpacity onPress={onClose}>
                            <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Grid of Categories */}
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>
                        <View style={styles.grid}>
                            {categories.map((category, index) => (
                                <View key={index} style={styles.gridItem}>
                                    <CategoryItem
                                        {...category}
                                        onPress={() => {
                                            onCategoryPress?.(category);
                                            onClose();
                                        }}
                                    />
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Done Button */}
                    <TouchableOpacity
                        style={[styles.doneBtn, { backgroundColor: colors.primary }]}
                        onPress={onClose}
                    >
                        <Text style={styles.doneBtnText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    overlayTouch: {
        flex: 1,
    },
    bottomSheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingTop: 16,
        paddingHorizontal: 10,
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
    },
    gridContainer: {
        paddingBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '25%',
        marginBottom: 24,
        alignItems: 'center',
    },
    doneBtn: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    doneBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
