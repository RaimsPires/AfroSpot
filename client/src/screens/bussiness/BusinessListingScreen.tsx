import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

import { AppIcon, Input } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp } from '@navigation/types';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// MOCK DATA
const MOCK_BUSINESSES = [
    {
        id: '1', title: 'Mama Africa Kitchen', type: 'Restaurant', rating: '4.8', distance: '0.4 km',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', tags: ['Jollof', 'Dine-in']
    },
    {
        id: '2', title: 'Silk Press Studio', type: 'Salon', rating: '4.9', distance: '1.2 km',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df', tags: ['Hair', 'Beauty']
    },
    {
        id: '3', title: 'Lagos Groceries', type: 'Shop', rating: '4.5', distance: '0.8 km',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e', tags: ['Market', 'Spices']
    },
];

const BusinessListingScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'BusinessListing'>>();
    const { colors, isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [isGridView, setIsGridView] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // Consolidated Filter States
    const [distance, setDistance] = useState('10');
    const [rating, setRating] = useState('4.0');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const renderItem = ({ item }: any) => {
        if (loading) {
            return (
                <View style={[styles.card, !isGridView && styles.listCard, { borderColor: colors.border }]}>
                    <Skeleton
                        isLoading={true}
                        layout={[{ key: 'img', width: isGridView ? '100%' : 100, height: isGridView ? 140 : 100, borderRadius: 16 }]}
                    />
                    <View style={{ flex: 1, marginLeft: isGridView ? 0 : 12, marginTop: isGridView ? 12 : 0 }}>
                        <Skeleton
                            isLoading={true}
                            layout={[
                                { key: 't1', width: '70%', height: 20, marginBottom: 10 },
                                { key: 't2', width: '40%', height: 14 }
                            ]}
                        />
                    </View>
                </View>
            );
        }

        return (
            <TouchableOpacity
                style={[styles.card, isGridView ? styles.gridCard : styles.listCard, { backgroundColor: colors.background, borderColor: colors.border }]}
            >
                <Image source={{ uri: item.image }} style={isGridView ? styles.gridImg : styles.listImg} />
                <View style={styles.infoContent}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.businessTitle, { color: colors.text }]}>{item.title}</Text>
                        <View style={styles.ratingRow}>
                            <AppIcon library="Feather" name="star" size={12} color="#F59E0B" />
                            <Text style={[styles.ratingText, { color: colors.text }]}> {item.rating}</Text>
                        </View>
                    </View>
                    <Text style={[styles.businessSub, { color: colors.textSecondary }]}>{item.type} • {item.distance}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Explore</Text>
                <TouchableOpacity onPress={() => setIsGridView(!isGridView)} style={[styles.toggleBtn, { backgroundColor: colors.surface }]}>
                    <AppIcon library="Feather" name={isGridView ? "list" : "grid"} size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* List Sub-header */}
            <View style={[styles.subHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
                    {loading ? 'Fetching...' : `${MOCK_BUSINESSES.length} Results`}
                </Text>
                <TouchableOpacity onPress={() => setIsFilterVisible(true)} style={[styles.filterBtn, { borderColor: colors.border }]}>
                    <AppIcon library="Feather" name="sliders" size={14} color={colors.text} />
                    <Text style={[styles.filterText, { color: colors.text }]}>Filters</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                key={isGridView ? 'GRID' : 'LIST'}
                data={loading ? Array.from({ length: 6 }) : MOCK_BUSINESSES}
                renderItem={renderItem}
                numColumns={isGridView ? 2 : 1}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={isGridView ? styles.columnWrapper : null}
            />

            {/* MODAL with Keyboard Handling */}
            <Modal visible={isFilterVisible} animationType="slide" transparent>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.keyboardView}
                        >
                            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                                {/* Visual Handle */}
                                <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />

                                <View style={styles.modalHeader}>
                                    <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
                                    <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                                        <AppIcon library="Feather" name="x" size={22} color={colors.text} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.filterItem}>
                                    <Text style={[styles.label, { color: colors.text }]}>MAX DISTANCE (KM)</Text>
                                    <Input
                                        value={distance}
                                        onChangeText={setDistance}
                                        placeholder="e.g. 10"
                                        keyboardType="number-pad"
                                        returnKeyType="done"
                                    />
                                </View>

                                <View style={styles.filterItem}>
                                    <Text style={[styles.label, { color: colors.text }]}>MINIMUM RATING</Text>
                                    <Input
                                        value={rating}
                                        onChangeText={setRating}
                                        placeholder="e.g. 4.0"
                                        keyboardType="decimal-pad"
                                        returnKeyType="done"
                                    />
                                </View>

                                <AppButton title="Apply Filters" onPress={() => {
                                    Keyboard.dismiss();
                                    setIsFilterVisible(false);
                                }} />
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    toggleBtn: { padding: 8, borderRadius: 10 },
    subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
    resultsText: { fontWeight: '700' },
    filterBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 },
    filterText: { fontSize: 13, fontWeight: '600' },
    listContainer: { padding: 16 },
    columnWrapper: { justifyContent: 'space-between' },
    card: { borderRadius: 20, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
    listCard: { flexDirection: 'row', padding: 12, alignItems: 'center' },
    gridCard: { width: (width - 44) / 2 },
    listImg: { width: 100, height: 100, borderRadius: 16 },
    gridImg: { width: '100%', height: 140 },
    infoContent: { flex: 1, padding: 12 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    businessTitle: { fontSize: 15, fontWeight: '800' },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { fontSize: 12, fontWeight: '700' },
    businessSub: { fontSize: 12, marginTop: 4 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    keyboardView: { width: '100%' },
    modalContent: { padding: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    filterItem: { marginBottom: 20 },
    label: { fontSize: 11, fontWeight: '900', letterSpacing: 1, marginBottom: 8 }
});

export default BusinessListingScreen;