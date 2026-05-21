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
import { logo } from '../../assets';

type SplashScreenProps = {
    onNext?: () => void;
};

const SplashScreen = ({ onNext,  }: SplashScreenProps) => {
    const { colors } = useTheme();


    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                translucent backgroundColor="transparent" />

            {/* Background Gradient */}
            <LinearGradient
                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                // locations={[0,0.5,0.6]}
                colors={[colors.primary, colors.secondary, colors.text]}
                style={styles.background}

            />

            <SafeAreaView style={styles.contentContainer}>
                {/* Top Spacer */}
                <View style={styles.spacer} />

                {/* Center Content */}
                <View style={styles.centerSection}>
                    {/* Logo Container */}
                    <View  >
                        <Image style={styles.logoBox}
                            source={logo} />
                    </View>

                    <Text style={styles.tagline}>
                        Discover African businesses{'\n'}anywhere
                    </Text>

                    {/* Accent Line */}
                    <View style={styles.accentLine} />
                </View>

                {/* Bottom Footer */}
                <View style={styles.footerSection}>
                    <Text style={styles.poweredBy}>POWERED BY CULTURE</Text>

                    <View style={styles.versionRow}>
                        <View style={styles.horizontalLine} />
                        <Text style={styles.versionText}>Version 1.0.4</Text>
                        <View style={styles.horizontalLine} />
                    </View>


                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onNext}
                        style={styles.nextButton}
                    >
                        <Text style={styles.nextText}>Get Started</Text>
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
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    spacer: {
        flex: 0.8,
    },
    centerSection: {
        flex: 2,
        alignItems: 'center',
        paddingHorizontal: 50,
    },
    logoBox: {
        width: 110,
        height: 110,
        marginBottom: 35,
        resizeMode: 'contain',
    },
    tagline: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 32,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
    accentLine: {
        width: 45,
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginTop: 25,
        borderRadius: 2,
    },
    footerSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    poweredBy: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 2.5,
        marginBottom: 12,
    },
    versionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 35,
    },
    versionText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        marginHorizontal: 12,
    },
    horizontalLine: {
        width: 25,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    nextButton: {
        marginTop: 26,
        paddingHorizontal: 24,
        paddingVertical: 11,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.45)',
    },
    nextText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.2,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
});

export default SplashScreen;