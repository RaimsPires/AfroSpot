import { logo } from '@assets/index';
import { useTheme } from '@contexts/ThemeContext';
import React from 'react';
import {
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

type SplashScreenProps = {
    onNext?: () => void;
};

const SplashScreen = ({ onNext }: SplashScreenProps) => {
    const { colors, isDark } = useTheme();
    const backgroundGradient = isDark
        ? ['#07090F', '#0C111A', '#111928']
        : [colors.surface, colors.background, '#F4F6FA'];
    const tintGradient = isDark
        ? ['rgba(12, 20, 32, 0.15)', 'rgba(80, 120, 175, 0.2)', 'rgba(0, 0, 0, 0)']
        : ['rgba(113, 69, 28, 0.08)', 'rgba(237, 140, 43, 0.14)', 'rgba(0, 0, 0, 0)'];
    const buttonGradient = isDark
        ? ['#243A57', '#172233']
        : [colors.primary, colors.secondary];
    const logoFrameStyle = [styles.logoFrame, { borderColor: `${colors.border}80`, backgroundColor: `${colors.surface}B3` }];
    const taglineStyle = [styles.tagline, { color: isDark ? '#EAF1FF' : colors.text }];
    const poweredByStyle = [styles.poweredBy, { color: isDark ? 'rgba(225, 235, 255, 0.72)' : `${colors.textSecondary}CC` }];
    const lineStyle = [styles.horizontalLine, { backgroundColor: isDark ? 'rgba(181, 204, 238, 0.33)' : `${colors.border}CC` }];
    const versionStyle = [styles.versionText, { color: isDark ? 'rgba(220, 230, 252, 0.5)' : colors.textSecondary }];
    const buttonStyle = [styles.nextButton, { borderColor: isDark ? 'rgba(160, 196, 255, 0.36)' : `${colors.secondary}80` }];
    const nextTextStyle = [styles.nextText, { color: isDark ? '#F9FCFF' : '#FFFFFF' }];
    const accentLineStyle = [styles.accentLine, { backgroundColor: `${colors.primary}B3` }];
    const glowTopStyle = [styles.glow, styles.glowTop, { backgroundColor: `${colors.secondary}33` }];
    const glowBottomStyle = [styles.glow, styles.glowBottom, { backgroundColor: `${colors.primary}2B` }];


    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                translucent backgroundColor="transparent" />

            {/* Background Gradient */}
            <LinearGradient
                start={{ x: 0.05, y: 0.1 }} end={{ x: 0.95, y: 1 }}
                colors={backgroundGradient}
                style={styles.background}

            />

            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={tintGradient}
                style={styles.tintOverlay}
            />

            <View style={glowTopStyle} />
            <View style={glowBottomStyle} />

            <SafeAreaView style={styles.contentContainer}>
                {/* Top Spacer */}
                <View style={styles.spacer} />

                {/* Center Content */}
                <View style={styles.centerSection}>
                    {/* Logo Container */}
                    <View style={logoFrameStyle}>
                        <Image style={styles.logoBox}
                            source={logo} />
                    </View>

                    <Text style={taglineStyle}>
                        Discover African businesses{`\n`}in a darker, richer vibe
                    </Text>

                    {/* Accent Line */}
                    <View style={accentLineStyle} />
                </View>

                {/* Bottom Footer */}
                <View style={styles.footerSection}>
                    <Text style={poweredByStyle}>POWERED BY CULTURE</Text>

                    <View style={styles.versionRow}>
                        <View style={lineStyle} />
                        <Text style={versionStyle}>Version 1.0.4</Text>
                        <View style={lineStyle} />
                    </View>


                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onNext}
                        style={buttonStyle}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            colors={buttonGradient}
                            style={styles.nextButtonGradient}
                        />
                        <Text style={nextTextStyle}>Get Started</Text>
                    </TouchableOpacity>
                </View>
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
    glow: {
        position: 'absolute',
        borderRadius: 999,
    },
    glowTop: {
        width: 280,
        height: 280,
        top: -90,
        right: -70,
    },
    glowBottom: {
        width: 250,
        height: 250,
        left: -70,
        bottom: 70,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    spacer: {
        flex: 0.95,
    },
    centerSection: {
        flex: 2,
        alignItems: 'center',
        paddingHorizontal: 36,
    },
    logoFrame: {
        width: 132,
        height: 132,
        borderRadius: 36,
        marginBottom: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    logoBox: {
        width: 98,
        height: 98,
        resizeMode: 'contain',
        borderRadius: 20,
    },
    tagline: {
        fontSize: 25,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 34,
        letterSpacing: 0.2,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
    accentLine: {
        width: 64,
        height: 4,
        marginTop: 22,
        borderRadius: 2,
    },
    footerSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 34,
    },
    poweredBy: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 3,
        marginBottom: 14,
    },
    versionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    versionText: {
        fontSize: 12,
        marginHorizontal: 14,
    },
    horizontalLine: {
        width: 34,
        height: 1,
    },
    nextButton: {
        marginTop: 22,
        minWidth: 176,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 999,
        borderWidth: 1,
    },
    nextButtonGradient: {
        ...StyleSheet.absoluteFill,
    },
    nextText: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.4,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
});

export default SplashScreen;