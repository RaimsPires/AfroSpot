import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddEditModalProduct from '@components/products/AddEditModalProduct';
import ProductEmptyState from '@components/products/ProductEmptyState';
import ProductHeader from '@components/products/ProductHeader';
import RenderProductItem from '@components/products/RenderProductItem';
import { useTheme } from '@contexts/ThemeContext';
import { productService } from '@services/productService';
import { ProductData } from '@type/product';

const ManageProductsScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    const [products, setProducts] = useState<ProductData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    
    // Store the ENTIRE product object when editing, null when creating new
    const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);

    // Fetch Products on Mount
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const data = await productService.getProducts();
            console.log(data);
            
            setProducts(data);
        } catch (error) {
            Alert.alert("Error", "Could not load products.");
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        fetchProducts();
    }, []);

    const openAddModal = () => {
        setEditingProduct(null);
        setModalVisible(true);
    };

    // Make sure RenderProductItem passes the full product object to this function!
    const openEditModal = (product: ProductData) => {
        setEditingProduct(product);
        setModalVisible(true);
    };

    const handleDelete = (id: number) => {
        Alert.alert('Delete Product', 'Are you sure you want to remove this product?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await productService.deleteProduct(id);
                        setProducts(prev => prev.filter(p => p.id !== id));
                    } catch (error) {
                        Alert.alert("Error", "Could not delete this product.");
                    }
                }
            },
        ]);
    };

    const handleSave = async (formData: FormData) => {
        try {
            if (editingProduct) {
                // UPDATE
                const updatedProduct = await productService.updateProduct(editingProduct.id, formData);
                setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
            } else {
                // CREATE
                const newProduct = await productService.createProduct(formData);
                setProducts([newProduct, ...products]);
            }
        } catch (error) {
            Alert.alert("Save Failed", "Could not save product information.");
            throw error; // Let the modal catch it to stop the loading spinner
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <ProductHeader openAddModal={openAddModal} />

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                    {products.length === 0 ? (
                        <ProductEmptyState openAddModal={openAddModal} />
                    ) : (
                        products.map((product) => (
                            <RenderProductItem
                                key={product.id.toString()}
                                product={product}
                                // Ensure your RenderProductItem accepts these props
                                onEdit={() => openEditModal(product)}
                                onDelete={() => handleDelete(product.id)}
                            />
                        ))
                    )}
                </ScrollView>
            )}

            <AddEditModalProduct
                modalVisible={modalVisible}
                editingProduct={editingProduct}
                closeModal={() => setModalVisible(false)}
                handleSave={handleSave}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
});

export default ManageProductsScreen;