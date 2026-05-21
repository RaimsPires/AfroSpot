import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

import { AppIcon } from '@components/ui';

import { MapLocationItem } from './types';

type MapMarkersProps = {
    locations: MapLocationItem[];
    colors: {
        primary: string;
        textSecondary: string;
    };
};

const MapMarkers = ({ locations, colors }: MapMarkersProps) => {
    return (
        <>
            {locations.map((marker) => (
                <Marker key={marker.id} coordinate={{ latitude: marker.lat, longitude: marker.lng }}>
                    <View style={styles.customMarkerContainer}>
                        <View
                            style={[
                                styles.markerCircle,
                                marker.type === 'active'
                                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                                    : { backgroundColor: '#FFF', borderColor: colors.primary },
                            ]}
                        >
                            <AppIcon
                                library="Feather"
                                name="map-pin"
                                size={14}
                                color={marker.type === 'active' ? '#FFF' : colors.primary}
                            />
                        </View>
                        <View
                            style={[
                                styles.markerLabel,
                                marker.type === 'active' ? { borderColor: colors.primary } : { borderColor: '#DDD' },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.markerLabelText,
                                    marker.type === 'active' ? { color: colors.primary } : { color: colors.textSecondary },
                                ]}
                            >
                                {marker.title}
                            </Text>
                        </View>
                    </View>
                </Marker>
            ))}

            <Marker coordinate={{ latitude: 40.81, longitude: -73.9425 }}>
                <View style={styles.userLocationHalo}>
                    <View style={styles.userLocationDot} />
                </View>
            </Marker>
        </>
    );
};

const styles = StyleSheet.create({
    customMarkerContainer: { alignItems: 'center' },
    markerCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    markerLabel: {
        marginTop: 4,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    markerLabelText: { fontSize: 11, fontWeight: '700' },
    userLocationHalo: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(59, 130, 246, 0.2)', alignItems: 'center', justifyContent: 'center' },
    userLocationDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#3B82F6', borderWidth: 2, borderColor: '#FFF' },
});

export default MapMarkers;
