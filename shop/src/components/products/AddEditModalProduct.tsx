import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { ProductData } from '@type/product';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'; // 🚀 Added
import { ImageLibraryOptions, ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';

// Assuming you use something like Expo ImagePicker. 
// If using another library, adjust these mock types to match your picker's output.
interface SelectedFile {
    uri: string;
    type?: string;
    fileName?: string;
}

interface AddEditModalProps {
    modalVisible: boolean;
    closeModal: () => void;
    editingProduct: ProductData | null;
    handleSave: (data: FormData) => Promise<void>;
}

const AddEditModalProduct: React.FC<AddEditModalProps> = ({ modalVisible, closeModal, editingProduct, handleSave }) => {
    const { colors } = useTheme()

    // Text Fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    // 🚀 New Separate Image States
    const [primaryImage, setPrimaryImage] = useState<SelectedFile | null>(null);
    const [galleryImages, setGalleryImages] = useState<SelectedFile[]>([]);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editingProduct && modalVisible) {
            setName(editingProduct.name);
            setDescription(editingProduct.description || '');
            setPrice(editingProduct.price);
            setStock(editingProduct.stock_quantity.toString());

            // Extract the existing primary image for display
            const existingPrimary = editingProduct.images?.find(img => img.is_primary);
            if (existingPrimary) {
                setPrimaryImage({ uri: existingPrimary.image });
            } else {
                setPrimaryImage(null);
            }

            // We clear gallery images because they cannot be edited here
            setGalleryImages([]);

        } else if (modalVisible) {
            // Reset for New Product
            setName(''); setDescription(''); setPrice(''); setStock('');
            setPrimaryImage(null); setGalleryImages([]);
        }
    }, [editingProduct, modalVisible]);

    // Mock image picker function (Replace with your actual image picker logic)
    const pickImage = async (type: 'primary' | 'gallery') => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo' as const,
            quality: 1,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                Alert.alert("Error", response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                const formattedFile = {
                    uri: asset.uri!,
                    type: asset.type || 'image/jpeg',
                    fileName: asset.fileName || 'upload.jpg'
                };

                if (type === 'primary') {
                    setPrimaryImage(formattedFile);
                } else {
                    if (galleryImages.length >= 10) {
                        Alert.alert("Limit Reached", "You can only add up to 10 gallery images.");
                        return;
                    }
                    setGalleryImages(prev => [...prev, formattedFile]);
                }
            }
        });
    };

    const removeGalleryItem = (index: number) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSavePress = async () => {
        if (!name || !price || !stock) return;

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('stock_quantity', stock);

            // 1. Append Primary Image (Only if it's a NEW local file, not a remote http URL)
            if (primaryImage && !primaryImage.uri.startsWith('http')) {
                formData.append('primary_image', {
                    uri: primaryImage.uri,
                    type: primaryImage.type || 'image/jpeg',
                    name: primaryImage.fileName || 'primary.jpg'
                } as any);
            }

            // 2. Append Gallery Images in their current exact dragged order (CREATE MODE ONLY)
            if (!editingProduct && galleryImages.length > 0) {
                galleryImages.forEach((img, index) => {
                    formData.append('gallery_images', {
                        uri: img.uri,
                        type: img.type || 'image/jpeg',
                        name: `gallery_${index}.jpg`
                    } as any);
                });
            }

            await handleSave(formData);
            closeModal();
        } finally {
            setIsSaving(false);
        }
    };

    // Render individual draggable gallery item
    const renderGalleryItem = ({ item, drag, isActive, getIndex }: any) => {
        const idx = getIndex();
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                        styles.galleryItemContainer,
                        { borderColor: colors.border },
                        isActive && { transform: [{ scale: 1.05 }], shadowOpacity: 0.2 }
                    ]}
                >
                    <Image source={{ uri: item.uri }} style={styles.galleryImage} />
                    {/* Delete overlay button */}
                    <TouchableOpacity style={[styles.removeGalleryBtn, { backgroundColor: colors.destructive }]} onPress={() => removeGalleryItem(idx)}>
                        <AppIcon library="Feather" name="x" size={12} color="#FFF" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return (
        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>

                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{editingProduct ? 'Edit Product' : 'Add New Product'}</Text>
                        <TouchableOpacity onPress={closeModal} style={styles.closeBtn} disabled={isSaving}>
                            <AppIcon library="Feather" name="x" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">

                        {/* --- PRIMARY IMAGE SECTION --- */}
                        <View style={styles.imageUploadSection}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRIMARY COVER IMAGE</Text>
                            {primaryImage ? (
                                <View style={styles.previewContainer}>
                                    <Image source={{ uri: primaryImage.uri }} style={styles.imagePreview} />
                                    <TouchableOpacity style={[styles.changeImageBtn, { backgroundColor: colors.destructive, borderColor: colors.surfaceElevated }]} onPress={() => setPrimaryImage(null)}>
                                        <AppIcon library="Feather" name="x" size={16} color={colors.textInverse} />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => pickImage('primary')}>
                                    <AppIcon library="Feather" name="image" size={28} color={colors.textSecondary} />
                                    <Text style={[styles.uploadText, { color: colors.textSecondary }]}>Add Cover Image</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* --- HORIZONTAL DRAG & DROP GALLERY (CREATE MODE ONLY) --- */}
                        {!editingProduct && (
                            <View style={styles.gallerySection}>
                                <View style={styles.galleryHeader}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>GALLERY ({galleryImages.length}/10)</Text>
                                    <Text style={[styles.helperText, { color: colors.textMuted }]}>Long press to drag & reorder</Text>
                                </View>

                                <View style={styles.galleryTrack}>
                                    <TouchableOpacity
                                        style={[styles.addGalleryBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                        onPress={() => pickImage('gallery')}
                                    >
                                        <AppIcon library="Feather" name="plus" size={24} color={colors.textSecondary} />
                                    </TouchableOpacity>

                                    <View style={{ flex: 1 }}>
                                        <DraggableFlatList
                                            horizontal
                                            data={galleryImages}
                                            onDragEnd={({ data }) => setGalleryImages(data)}
                                            keyExtractor={(item, index) => `gallery-${index}`}
                                            renderItem={renderGalleryItem}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ paddingLeft: 12 }}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* --- STANDARD TEXT INPUTS --- */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRODUCT NAME</Text>
                            <TextInput style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={name} onChangeText={setName} />
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>PRICE</Text>
                                <TextInput style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>INVENTORY</Text>
                                <TextInput style={[styles.inputField, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={stock} onChangeText={setStock} keyboardType="number-pad" />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>DESCRIPTION</Text>
                            <TextInput style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={description} onChangeText={setDescription} multiline textAlignVertical="top" />
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

export default AddEditModalProduct;

// Updated Styles to accommodate the new gallery
const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '95%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    closeBtn: { padding: 4 },
    modalScroll: { paddingHorizontal: 20, paddingBottom: 20 },

    inputGroup: { marginBottom: 20 },
    rowInputs: { flexDirection: 'row' },
    inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
    helperText: { fontSize: 10, fontWeight: '500', marginBottom: 8 },
    inputField: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    textArea: { height: 100, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15 },

    // Primary Image Styles
    imageUploadSection: { marginBottom: 24 },
    uploadBox: { height: 120, borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    uploadText: { marginTop: 8, fontSize: 13, fontWeight: '600' },
    previewContainer: { position: 'relative', height: 120, width: '100%' }, // Made 100% width for hero banner look
    imagePreview: { width: '100%', height: '100%', borderRadius: 12 },
    changeImageBtn: { position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },

    // Gallery Drag & Drop Styles
    gallerySection: { marginBottom: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    galleryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    galleryTrack: { flexDirection: 'row', alignItems: 'center', height: 80 },
    addGalleryBtn: { width: 80, height: 80, borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    galleryItemContainer: { width: 80, height: 80, marginRight: 10, borderRadius: 12, borderWidth: 1, position: 'relative' },
    galleryImage: { width: '100%', height: '100%', borderRadius: 11 },
    removeGalleryBtn: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFF' },

    modalFooter: { flexDirection: 'row', padding: 20, paddingBottom: 34, borderTopWidth: 1, gap: 12 },
    cancelBtn: { flex: 1, height: 52, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    cancelBtnText: { fontSize: 15, fontWeight: '700' },
    saveActionBtn: { flex: 1.5, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    saveActionBtnText: { fontSize: 15, fontWeight: '700' },
});