import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CAROUSEL_WIDTH = width - 32; // Full width minus side margins

const FEATURED_DATA = [
    {
        id: '1',
        businessId: 'mama-africa-kitchen',
        title: 'Mama Africa Kitchen',
        sub: 'Authentic Jollof & Pounded Yam',
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=1000',
        badge: 'Featured',
    },
    {
        id: '2',
        businessId: 'safari-lounge',
        title: 'Safari Lounge',
        sub: 'Premium Cocktails & Afro-beats',
        image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1000',
        badge: 'Trending',
    },
    {
        id: '3',
        businessId: 'lagos-lux-styles',
        title: 'Lagos Lux Styles',
        sub: 'Bespoke Traditional Wear',
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=1000',
        badge: 'New Opening',
    },
];

const FeaturedCarousel = () => {
    const { colors } = useTheme();
    const navigation = useNavigation<AppStackNavigationProp<'Home'>>();
    const scrollX = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            activeOpacity={0.92}
            onPress={() =>
                navigation.navigate('BusinessDetail', {
                    businessId: item.businessId,
                    businessName: item.title,
                    source: 'featured-carousel',
                })
            }
        >
            <ImageBackground
                source={{ uri: item.image }}
                style={styles.carouselItem}
                imageStyle={{ borderRadius: 24 }}
            >
                <View style={styles.featuredOverlay}>
                    <View style={[styles.featuredBadge, { backgroundColor: colors.primary }]}> 
                        <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                    <View>
                        <Text style={styles.featuredTitle}>{item.title}</Text>
                        <Text style={styles.featuredSub}>{item.sub}</Text>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );

    return (
        <View style={styles.carouselContainer}>
            <FlatList
                data={FEATURED_DATA}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                decelerationRate="fast"
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                keyExtractor={(item) => item.id}
            />

            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
                {FEATURED_DATA.map((_, index) => {
                    const widthAnim = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * CAROUSEL_WIDTH,
                            index * CAROUSEL_WIDTH,
                            (index + 1) * CAROUSEL_WIDTH,
                        ],
                        outputRange: [8, 20, 8],
                        extrapolate: 'clamp',
                    });

                    const opacityAnim = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * CAROUSEL_WIDTH,
                            index * CAROUSEL_WIDTH,
                            (index + 1) * CAROUSEL_WIDTH,
                        ],
                        outputRange: [0.4, 1, 0.4],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    width: widthAnim,
                                    opacity: opacityAnim,
                                    backgroundColor: colors.primary,
                                },
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: 16,
        marginBottom: 8,
    },
    carouselItem: {
        width: CAROUSEL_WIDTH,
        height: 180,
        marginHorizontal: 16, // Matches the spacing of the search bar and other sections
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    featuredOverlay: {
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.4)', // Slightly darker for better text readability
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    featuredBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    badgeText: { color: '#FFF', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    featuredTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
    featuredSub: { color: '#FFF', opacity: 0.9, fontSize: 12 },

    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
});

export default FeaturedCarousel;