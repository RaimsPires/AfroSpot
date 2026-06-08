import { AppIcon } from '@components/ui'
import { useTheme } from '@contexts/ThemeContext'
import React, { useState } from 'react'
import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const AddEditModalProduct: React.FC<{ modalVisible: boolean, handleSave: () => void, closeModal: () => void, editingId: string }> = ({ modalVisible, closeModal, handleSave }) => {
    const { colors } = useTheme()
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [productImage, setProductImage] = useState<string | null>(null);
    return (
        <Modal visible={modalVisible} transparent animationType="slide">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
            >
                <View style={[styles.modalContent, { backgroundColor: colors.background, borderTopColor: colors.border }]}>

                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            {editingId ? 'Edit Product' : 'Add New Product'}
                        </Text>
                        <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                            <AppIcon library="Feather" name="x" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>

                        {/* Product Image Upload */}
                        <View style={styles.imageUploadSection}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRODUCT IMAGE</Text>
                            {productImage ? (
                                <View style={styles.previewContainer}>
                                    <Image source={{ uri: productImage }} style={styles.imagePreview} />
                                    <TouchableOpacity
                                        style={[styles.changeImageBtn, { backgroundColor: colors.destructive, borderColor: colors.surfaceElevated }]}
                                        onPress={() => setProductImage(null)}
                                    >
                                        <AppIcon library="Feather" name="x" size={16} color={colors.textInverse} />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <AppIcon library="Feather" name="upload-cloud" size={28} color={colors.textSecondary} />
                                    <Text style={[styles.uploadText, { color: colors.textSecondary }]}>Tap to upload photo</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRODUCT NAME</Text>
                            <TextInput
                                style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="e.g. Handmade Woven Basket"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRICE ($)</Text>
                                <TextInput
                                    style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                    value={price}
                                    onChangeText={setPrice}
                                    placeholder="0.00"
                                    keyboardType="decimal-pad"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>INVENTORY</Text>
                                <TextInput
                                    style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                    value={stock}
                                    onChangeText={setStock}
                                    placeholder="Stock count"
                                    keyboardType="number-pad"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DESCRIPTION (OPTIONAL)</Text>
                            <TextInput
                                style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe your product..."
                                placeholderTextColor={colors.textSecondary}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                    </ScrollView>

                    <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                        <TouchableOpacity
                            style={[styles.cancelBtn, { borderColor: colors.border }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.saveActionBtn, { backgroundColor: colors.primary }]}
                            onPress={handleSave}
                        >
                            <Text style={[styles.saveActionBtnText, { color: colors.textInverse }]}>Save Product</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default AddEditModalProduct

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '95%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    closeBtn: { padding: 4 },
    modalScroll: { paddingHorizontal: 20, paddingBottom: 20 },

    // Inputs
    inputGroup: { marginBottom: 20 },
    rowInputs: { flexDirection: 'row' },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
    inputField: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    textArea: { height: 100, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15 },

    // Image Upload
    imageUploadSection: { marginBottom: 24 },
    uploadBox: { height: 120, borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    uploadText: { marginTop: 8, fontSize: 13, fontWeight: '600' },
    previewContainer: { position: 'relative', height: 120, width: 120 },
    imagePreview: { width: '100%', height: '100%', borderRadius: 12 },
    changeImageBtn: { position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },

    // Modal Footer
    modalFooter: { flexDirection: 'row', padding: 20, paddingBottom: 34, borderTopWidth: 1, gap: 12 },
    cancelBtn: { flex: 1, height: 52, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    cancelBtnText: { fontSize: 15, fontWeight: '700' },
    saveActionBtn: { flex: 1.5, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    saveActionBtnText: { fontSize: 15, fontWeight: '700' },
})