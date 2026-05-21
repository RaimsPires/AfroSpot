import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';

type MapControlsProps = {
    colors: {
        text: string;
    };
};

const MapControls = ({ colors }: MapControlsProps) => {
    return (
        <View style={styles.mapControls}>
            <TouchableOpacity style={[styles.controlBtn, { shadowColor: colors.text }]}> 
                <AppIcon library="Feather" name="navigation" size={18} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlBtn, { shadowColor: colors.text, marginTop: 12 }]}> 
                <AppIcon library="Feather" name="map-pin" size={18} color={colors.text} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mapControls: { position: 'absolute', right: 16, top: 160, zIndex: 5 },
    controlBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});

export default MapControls;
