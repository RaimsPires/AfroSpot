import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface Props {
    visible: boolean;
}

const GlobalActivityOverlay: React.FC<Props> = ({ visible }) => {
    const { colors } = useTheme();

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <View style={[styles.indicatorContainer, { backgroundColor: colors.surface }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        zIndex: 999, // Ensure it sits on top of everything
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorContainer: {
        padding: 20,
        borderRadius: 20,
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
});

export default GlobalActivityOverlay;