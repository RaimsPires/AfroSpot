import { AppIcon, Input } from '@components/ui';
import AppButton from '@components/ui/Button';
import { useTheme } from '@contexts/ThemeContext';
import type { AppStackNavigationProp, AppStackRouteProp } from '@navigation/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SearchScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'Search'>>();
    const route = useRoute<AppStackRouteProp<'Search'>>();
    const { colors, isDark } = useTheme();
    const categories = ['All', 'Restaurants', 'Beauty', 'Markets', 'Fashion', 'Events'];
    const initialCategory = route.params?.initialCategory;
    const [viewMode, setViewMode] = useState<'list' | 'map'>(route.params?.initialView ?? 'list');
    const [activeCategory, setActiveCategory] = useState(
        initialCategory && categories.includes(initialCategory) ? initialCategory : 'All'
    );
    const [searchQuery, setSearchQuery] = useState(route.params?.initialQuery ?? '');

    // Filter States
    const [distance, setDistance] = useState('10');
    const [country, setCountry] = useState('Nigeria');
    const [rating, setRating] = useState('4.5');

    // Mock Data for Map Markers
    const MOCK_LOCATIONS = [
        { id: 1, title: 'Mama Africa', type: 'Restaurant', lat: 6.5244, lng: 3.3792 },
        { id: 2, title: 'Elegant Braids', type: 'Salon', lat: 6.5344, lng: 3.3892 },
        { id: 3, title: 'Lagos Market', type: 'Market', lat: 6.5144, lng: 3.3692 },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header stays consistent */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
                    <AppIcon library="Feather" name="search" size={18} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Search African businesses..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={[styles.searchInput, { color: colors.text }]}
                    />
                </View>
            </View>

            {viewMode === 'list' ? (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Category Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabsRow}>
                        <TouchableOpacity style={[styles.filterIconBtn, { borderColor: colors.border }]}>
                            <AppIcon library="Feather" name="sliders" size={16} color={colors.primary} />
                            <Text style={[styles.filterIconText, { color: colors.primary }]}>Filters</Text>
                        </TouchableOpacity>
                        <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
                        {categories.map((cat) => (
                            <TouchableOpacity key={cat} onPress={() => setActiveCategory(cat)}
                                style={[styles.categoryTab, { backgroundColor: activeCategory === cat ? colors.primary : colors.background, borderColor: colors.border }]}>
                                <Text style={{ color: activeCategory === cat ? '#FFF' : colors.text, fontWeight: '600' }}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Expandable Filters with Inputs */}
                    <View style={styles.accordionGroup}>
                        <FilterAccordion 
                            icon="navigation" label="Distance (km)" 
                            value={distance} onChange={setDistance} 
                            placeholder="e.g. 15" colors={colors} 
                        />
                        <FilterAccordion 
                            icon="globe" label="Country of Origin" 
                            value={country} onChange={setCountry} 
                            placeholder="e.g. Ghana" colors={colors} 
                        />
                        <FilterAccordion 
                            icon="star" label="Min. Rating" 
                            value={rating} onChange={setRating} 
                            placeholder="e.g. 4.0" colors={colors} 
                            keyboardType="decimal-pad"
                        />
                    </View>

                    {/* Content continues (Smart Suggestions etc.) */}
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>RECENT SEARCHES</Text>
                    {/* ... (Previous logic for suggestions) */}
                </ScrollView>
            ) : (
                <View style={styles.mapWrapper}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: 6.5244,
                            longitude: 3.3792,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                    >
                        {MOCK_LOCATIONS.map(loc => (
                            <Marker 
                                key={loc.id} 
                                coordinate={{ latitude: loc.lat, longitude: loc.lng }}
                                pinColor={loc.type === 'Salon' ? '#E91E63' : colors.primary}
                            >
                                <Callout>
                                    <View style={styles.callout}>
                                        <Text style={styles.calloutTitle}>{loc.title}</Text>
                                        <Text style={styles.calloutSub}>{loc.type}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>
                </View>
            )}

            {/* 6. Improved Floating Toggle */}
            <View style={styles.floatingToggleContainer}>
                <View style={[styles.toggleBackground, { backgroundColor: '#262626' }]}>
                    <TouchableOpacity 
                        onPress={() => setViewMode('list')}
                        style={[styles.toggleBtn, viewMode === 'list' && { backgroundColor: colors.primary }]}
                    >
                        <AppIcon library="Feather" name="list" size={16} color="#FFF" />
                        <Text style={styles.toggleText}>List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setViewMode('map')}
                        style={[styles.toggleBtn, viewMode === 'map' && { backgroundColor: colors.primary }]}
                    >
                        <AppIcon library="Feather" name="map" size={16} color="#FFF" />
                        <Text style={styles.toggleText}>Map</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Footer actions */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity style={[styles.resetBtn, { borderColor: colors.border }]}>
                    <Text style={[styles.resetText, { color: colors.text }]}>Reset</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <AppButton title={viewMode === 'list' ? "Apply Filters" : "Search in this area"} onPress={() => { }} />
                </View>
            </View>
        </SafeAreaView>
    );
};

// --- Helper Components ---

const FilterAccordion = ({ icon, label, value, onChange, placeholder, keyboardType, colors }: any) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <TouchableOpacity 
                onPress={() => setExpanded(!expanded)}
                style={styles.accordionHeader}
            >
                <View style={styles.accordionLeft}>
                    <AppIcon library="Feather" name={icon} size={18} color={colors.primary} />
                    <Text style={[styles.accordionText, { color: colors.text }]}>{label}</Text>
                </View>
                <AppIcon library="Feather" name={expanded ? "chevron-up" : "chevron-down"} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {expanded && (
                <View style={styles.accordionContent}>
                    <Input 
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChange}
                        keyboardType={keyboardType || 'default'}
                    />
                </View>
            )}
        </View>
    );
};


export default SearchScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
    backBtn: { padding: 4 },
    searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 44, borderRadius: 12, gap: 8 },
    searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
    
    scrollContent: { paddingBottom: 150 },
    filterTabsRow: { paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center', gap: 10 },
    filterIconBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, gap: 6 },
    filterIconText: { fontWeight: '700', fontSize: 14 },
    verticalDivider: { width: 1, height: 24, marginHorizontal: 4 },
    categoryTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },

    // Accordion Styles
    accordionGroup: { paddingHorizontal: 16, marginTop: 8 },
    accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18 },
    accordionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    accordionText: { fontSize: 16, fontWeight: '700' },
    accordionContent: { paddingBottom: 16, paddingHorizontal: 4 },

    // Map Styles
    mapWrapper: { flex: 1 },
    map: { width: width, height: height - 150 },
    callout: { padding: 10, minWidth: 120 },
    calloutTitle: { fontWeight: 'bold', fontSize: 14 },
    calloutSub: { color: '#666', fontSize: 12 },

    sectionLabel: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5, paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },

    floatingToggleContainer: { position: 'absolute', bottom: 120, width: '100%', alignItems: 'center', zIndex: 10 },
    toggleBackground: { flexDirection: 'row', borderRadius: 25, padding: 4, width: 180 },
    toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 20, gap: 8 },
    toggleText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, flexDirection: 'row', borderTopWidth: 1, paddingBottom: 34, zIndex: 5 },
    resetBtn: { height: 52, paddingHorizontal: 24, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    resetText: { fontWeight: '700', fontSize: 16 },
});