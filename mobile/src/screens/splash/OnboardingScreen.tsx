import { jollof, logo } from '@/assets';
import { AppIcon } from '@/components/ui';
import AppButton from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import {
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const OnboardingScreen = () => {
    const { colors, spacing } = useTheme();

    const features = [
        { id: '1', title: 'Dine-In', sub: 'Top-rated spots', icon: 'restaurant', color: '#FDF2E9' },
        { id: '2', title: 'Groceries', sub: 'Exotic staples', icon: 'shopping-basket', color: '#EAF9F1' },
        { id: '3', title: 'Delivery', sub: 'Fast & reliable', icon: 'delivery-dining', color: '#F3F4F6' },
        { id: '4', title: 'Real Reviews', sub: 'Community-led', icon: 'star', color: '#FFFBEB' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* 1. Image Header Section */}
            <ImageBackground
                source={ jollof} // Replace with local asset
                style={styles.headerImage}
            >
                <SafeAreaView style={styles.headerContent}>
                    <View style={styles.logoRow}>
                        <Image source={logo} style={styles.logoIcon} />
                        <Text style={styles.logoText}>AfroSpot</Text>
                    </View>

                    <View style={styles.badge}>
                        <AppIcon library="AntDesign" name="check-circle" size={14} color="#f1f5f3" />
                        <Text style={styles.badgeText}>VERIFIED VENDORS</Text>
                    </View>
                </SafeAreaView>
            </ImageBackground>

            {/* 2. Content Card Section */}
            <View style={[styles.card, { backgroundColor: colors.background, marginTop: -40 }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* Pagination Indicator */}
                    <View style={styles.paginationRow}>
                        <View style={[styles.dot, { backgroundColor: colors.border }]} />
                        <View style={[styles.activeBar, { backgroundColor: colors.primary }]} />
                        <View style={[styles.dot, { backgroundColor: colors.border }]} />
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>
                        Find <Text style={{ color: colors.primary }}>African</Text>{'\n'}Restaurants & Markets
                    </Text>

                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        The flavors of home are closer than you think. Explore verified eateries,
                        order authentic groceries, and support local entrepreneurs.
                    </Text>

                    {/* 3. Feature Grid */}
                    <View style={styles.grid}>
                        {features.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.gridItem, { backgroundColor: item.color }]}
                            >
                                <View style={styles.iconContainer}>
                                    <AppIcon library="MaterialIcons" name={item.icon} size={24} color={colors.primary} />
                                </View>
                                <View>
                                    <Text style={styles.gridTitle}>{item.title}</Text>
                                    <Text style={styles.gridSub}>{item.sub}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* 4. Actions */}
                    <AppButton
                        title="Explore Marketplaces"
                        rightIcon='arrow-right'
                        // rightIcon={<AppIcon library="Feather" name="arrow-right" size={20} color="#FFF" />}
                        onPress={() => { }}
                        style={{ marginTop: spacing(3) }}
                    />

                    <TouchableOpacity style={styles.skipButton}>
                        <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip for now</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerImage: { height: 400, width: '100%' },
    headerContent: { padding: 20, justifyContent: 'space-between', height: '100%' , backgroundColor: 'rgba(2, 2, 2, 0.28)'},
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logoIcon: { backgroundColor: "white", borderColor: "#D68439", borderWidth: 2, padding: 6, borderRadius: 9999, height: 50, width: 50, resizeMode: 'contain' },
    logoText: { color: '#D68439', fontSize: 22, fontWeight: '900' },
    badge: {
        alignSelf: 'flex-end',
        backgroundColor: '#22C55E33',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#22C55E',
    },
    badgeText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
    card: {
        flex: 1,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    paginationRow: { flexDirection: 'row', gap: 6, marginBottom: 20, alignItems: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4 },
    activeBar: { width: 30, height: 8, borderRadius: 4 },
    title: { fontSize: 32, fontWeight: '800', lineHeight: 40, marginBottom: 16 },
    description: { fontSize: 15, lineHeight: 24, marginBottom: 24 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    gridItem: {
        width: '48%',
        padding: 12,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    gridTitle: { fontWeight: '700', fontSize: 14, color: '#1A1A1A' },
    gridSub: { fontSize: 11, color: '#666' },
    iconContainer: { backgroundColor: '#FFF', padding: 8, borderRadius: 12 },
    skipButton: { marginTop: 20, alignItems: 'center' },
    skipText: { fontWeight: '600', fontSize: 16 },
});

export default OnboardingScreen;