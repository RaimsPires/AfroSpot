import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

type Collection = {
    id: string;
    title: string;
    subtitle: string;
    places: number;
    image: string;
};

type ExploreCollectionCardProps = {
    collection: Collection;
    onPress?: () => void;
};

const ExploreCollectionCard = ({ collection, onPress }: ExploreCollectionCardProps) => (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.collectionCard}>
        <ImageBackground
            source={{ uri: collection.image }}
            style={styles.collectionImage}
            imageStyle={{ borderRadius: 16 }}
        >
            <View style={styles.collectionOverlay}>
                <View style={styles.placesBadge}>
                    <Text style={styles.placesBadgeText}>{collection.places} PLACES</Text>
                </View>
                <View>
                    <Text style={styles.collectionTitle}>{collection.title}</Text>
                    <Text style={styles.collectionSubtitle}>{collection.subtitle}</Text>
                </View>
            </View>
        </ImageBackground>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    collectionCard: { width: width * 0.65, height: 200, borderRadius: 16 },
    collectionImage: { width: '100%', height: '100%' },
    collectionOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
    },
    placesBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    placesBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
    collectionTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', marginBottom: 4 },
    collectionSubtitle: { color: '#FFF', fontSize: 13, fontWeight: '500', opacity: 0.9 },
});

export default ExploreCollectionCard;
