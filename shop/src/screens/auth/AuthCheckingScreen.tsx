import { logo } from '@assets/index';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthCheckingScreen = () => {
    const { colors, isDark } = useTheme();

    const backgroundGradient = isDark
        ? ['#07090F', '#0C111A', '#111928']
        : [colors.surface, colors.background, '#F4F6FA'];
    const tintGradient = isDark
        ? ['rgba(12, 20, 32, 0.15)', 'rgba(80, 120, 175, 0.2)', 'rgba(0, 0, 0, 0)']
        : ['rgba(113, 69, 28, 0.08)', 'rgba(237, 140, 43, 0.14)', 'rgba(0, 0, 0, 0)'];
    const titleStyle = [styles.title, { color: isDark ? '#EAF1FF' : colors.text }];
    const subtitleStyle = [
        styles.subtitle,
        { color: isDark ? 'rgba(225, 235, 255, 0.72)' : colors.textSecondary },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <LinearGradient
                start={{ x: 0.05, y: 0.1 }}
                end={{ x: 0.95, y: 1 }}
                colors={backgroundGradient}
                style={styles.background}
            />

            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={tintGradient}
                style={styles.tintOverlay}
            />

            <SafeAreaView style={styles.contentContainer}>
                <View style={[styles.logoFrame, { borderColor: `${colors.border}80`, backgroundColor: `${colors.surface}B3` }]}>
                    <Image style={styles.logoBox} source={logo} />
                </View>

                <Text style={titleStyle}>Preparing your session</Text>
                <Text style={subtitleStyle}>Verifying authentication details...</Text>

                <ActivityIndicator
                    size="small"
                    color={isDark ? '#F9FCFF' : colors.primary}
                    style={styles.indicator}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFill,
    },
    tintOverlay: {
        ...StyleSheet.absoluteFill,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logoFrame: {
        width: 120,
        height: 120,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginBottom: 26,
    },
    logoBox: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
        borderRadius: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: 0.2,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
    subtitle: {
        marginTop: 10,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
    },
    indicator: {
        marginTop: 18,
    },
});

export default AuthCheckingScreen;
