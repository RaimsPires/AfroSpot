import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { ProductData } from '@type/product';
import { CROP_PRESETS, pickAndCropImage, ShopImageFile } from '@utils/shopImagePicker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Import your custom picker tools

// Notice we expanded handleSave to optionally accept the new image file
interface AddEditModalProps {
    modalVisible: boolean;
    closeModal: () => void;
    editingProduct: ProductData | null;
    handleSave: (data: FormData, newImageFile?: ShopImageFile) => Promise<void>;
}

const AddEditModalProduct: React.FC<AddEditModalProps> = ({ modalVisible, closeModal, editingProduct, handleSave }) => {
    const { colors } = useTheme()

    // Form States
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    // UI Preview State (holds the remote URL or the local device URI)
    const [productImageUri, setProductImageUri] = useState<string | null>(null);
    // Data State (holds the actual file object to upload)
    const [selectedImageFile, setSelectedImageFile] = useState<ShopImageFile | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    // Sync state when modal opens
    useEffect(() => {
        if (editingProduct && modalVisible) {
            setName(editingProduct.name);
            setDescription(editingProduct.description || '');
            setPrice(editingProduct.price);
            setStock(editingProduct.stock_quantity.toString());
            setProductImageUri(editingProduct.image); // Remote URL from existing product
            setSelectedImageFile(null); // Reset pending uploads
        } else if (modalVisible) {
            // Reset for new product
            setName('');
            setDescription('');
            setPrice('');
            setStock('');
            setProductImageUri(null);
            setSelectedImageFile(null);
        }
    }, [editingProduct, modalVisible]);

    // --- NEW: Image Picker Handler ---
    const handlePickImage = async () => {
        // You can use CROP_PRESETS.banner, or if you have a product-specific one, use that.
        const result = await pickAndCropImage(
            'gallery',
            CROP_PRESETS.sqaure,
            'Image upload failed',
            'Could not select product image.'
        );
        console.log(result);

        if (result) {
            setSelectedImageFile(result);       // Save file object for backend upload
            setProductImageUri(result.path);     // Show local preview immediately
        }
    };

    const handleClearImage = () => {
        setProductImageUri(null);
        setSelectedImageFile(null);
    };

    const onSavePress = async () => {
    if (!name || !price || !stock) return;

    setIsSaving(true);
    try {
        const formData = new FormData();
        
        // 1. Append standard text fields
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock_quantity', stock);

        // 2. Append the image file correctly for React Native
        if (selectedImageFile) {
            // Note: 'image' should match the field name expected by your Django backend
            formData.append('image', {
                uri: selectedImageFile.path,
                type: selectedImageFile.mimeType || 'image/jpeg', // Fallback MIME type
                name: selectedImageFile.fileName || 'product_upload.jpg', // Fallback file name
            } as any); 
            // The 'as any' cast is often required in TypeScript because the 
            // standard TS DOM types don't recognize React Native's file object structure.
        }

        // 3. Pass the fully constructed FormData to your parent function
        await handleSave(formData); 
        
        closeModal();
    } catch (error) {
        console.error("Error saving product:", error);
        // You might want to show an alert to the user here
    } finally {
        setIsSaving(false);
    }
};

    return (
        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.modalContent, { backgroundColor: colors.background, borderTopColor: colors.border }]}>

                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </Text>
                        <TouchableOpacity onPress={closeModal} style={styles.closeBtn} disabled={isSaving}>
                            <AppIcon library="Feather" name="x" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">

                        {/* --- Image Upload UI --- */}
                        <View style={styles.imageUploadSection}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRODUCT IMAGE</Text>
                            {productImageUri ? (
                                <View style={styles.previewContainer}>
                                    <Image source={{ uri: productImageUri }} style={styles.imagePreview} />
                                    <TouchableOpacity
                                        style={[styles.changeImageBtn, { backgroundColor: colors.destructive, borderColor: colors.surfaceElevated }]}
                                        onPress={handleClearImage}
                                    >
                                        <AppIcon library="Feather" name="x" size={16} color={colors.textInverse} />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                    onPress={handlePickImage} // <-- Attached picker here
                                >
                                    <AppIcon library="Feather" name="upload-cloud" size={28} color={colors.textSecondary} />
                                    <Text style={[styles.uploadText, { color: colors.textSecondary }]}>Tap to upload photo</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRODUCT NAME</Text>
                            <TextInput style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={name} onChangeText={setName} placeholder="e.g. Handmade Woven Basket" placeholderTextColor={colors.textSecondary} />
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRICE</Text>
                                <TextInput style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={price} onChangeText={setPrice} placeholder="0.00" keyboardType="decimal-pad" placeholderTextColor={colors.textSecondary} />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>INVENTORY</Text>
                                <TextInput style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={stock} onChangeText={setStock} placeholder="Stock count" keyboardType="number-pad" placeholderTextColor={colors.textSecondary} />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DESCRIPTION</Text>
                            <TextInput style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={description} onChangeText={setDescription} placeholder="Describe your product..." placeholderTextColor={colors.textSecondary} multiline textAlignVertical="top" />
                        </View>
                    </ScrollView>

                    <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                        <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={closeModal} disabled={isSaving}>
                            <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.saveActionBtn, { backgroundColor: colors.primary, opacity: isSaving ? 0.7 : 1 }]} onPress={onSavePress} disabled={isSaving || !name || !price || !stock}>
                            {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.saveActionBtnText, { color: colors.textInverse }]}>Save Product</Text>}
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