import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { palette } from '../../theme/theme';
import AppIcon from './AppIcon';

type ButtonVariant = 'solid' | 'outline' | 'ghost';
type ButtonColor = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type LoadingType = 'indicator' | 'text' | 'pulse';

// Définition des librairies disponibles basées sur votre composant AppIcon
type IconLibrary = 'Feather' | 'Ionicons' | 'EvilIcons' | 'AntDesign';

interface AppButtonProps {
    title: string;
    onPress?: () => void;
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    loading?: boolean;
    loadingType?: LoadingType;
    disabled?: boolean;
    
    // Nouvelles props pour les icônes
    leftIcon?: string;
    rightIcon?: string;
    iconLibrary?: IconLibrary;
    
    style?: ViewStyle;
}

const AppButton: React.FC<AppButtonProps> = ({
    title, 
    onPress, 
    variant = 'solid', 
    color = 'primary', 
    size = 'md',
    loading = false, 
    loadingType = 'indicator', 
    disabled = false,
    leftIcon, 
    rightIcon, 
    iconLibrary = 'Feather', // Valeur par défaut
    style
}) => {
    const { colors, spacing, isDark } = useTheme();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (loading && loadingType === 'pulse') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 0.4, duration: 600, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [loading, loadingType, pulseAnim]);

    const getDynamicStyles = () => {
        const isDanger = color === 'danger';
        const baseColor = isDanger ? colors.error : color === 'primary' ? colors.primary : colors.secondary;

        if (disabled) return { bg: colors.buttonDisabled, text: colors.buttonDisabledText, border: colors.buttonDisabled };

        switch (variant) {
            case 'outline': return { bg: 'transparent', text: baseColor, border: baseColor };
            case 'ghost': return { bg: 'transparent', text: baseColor, border: 'transparent' };
            default: return { bg: baseColor, text: isDark && color === 'secondary' ? palette.black : palette.white, border: baseColor };
        }
    };

    const active = getDynamicStyles();
    
    // Définition d'une taille d'icône proportionnelle à la taille du bouton
    const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

    return (
        <Animated.View style={{ opacity: pulseAnim, width: '100%' }}>
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.7}
                style={[
                    styles.base,
                    styles[size] as ViewStyle,
                    {
                        backgroundColor: active.bg,
                        borderColor: active.border,
                        borderWidth: variant === 'outline' ? 1.5 : 0,
                        paddingHorizontal: spacing(2)
                    },
                    style
                ]}
            >
                {loading && loadingType !== 'pulse' ? (
                    <View style={styles.loaderContainer}>
                        {loadingType === 'indicator' ? (
                            <ActivityIndicator color={active.text} size="small" />
                        ) : (
                            <Text style={[styles.text, { color: active.text }]}>Loading...</Text>
                        )}
                    </View>
                ) : (
                    <View style={styles.content}>
                        {/* Affichage conditionnel de l'icône de gauche */}
                        {leftIcon && (
                            <View style={{ marginRight: spacing(1) }}>
                                <AppIcon 
                                    library={iconLibrary} 
                                    name={leftIcon} 
                                    size={iconSize} 
                                    color={active.text} 
                                />
                            </View>
                        )}
                        
                        <Text style={[styles.text, styles[`text_${size}`] as TextStyle, { color: active.text }]}>
                            {title}
                        </Text>

                        {/* Affichage conditionnel de l'icône de droite */}
                        {rightIcon && (
                            <View style={{ marginLeft: spacing(1) }}>
                                <AppIcon 
                                    library={iconLibrary} 
                                    name={rightIcon} 
                                    size={iconSize} 
                                    color={active.text} 
                                />
                            </View>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    base: { borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginVertical: 6 },
    content: { flexDirection: 'row', alignItems: 'center' },
    loaderContainer: { height: 24, justifyContent: 'center' },
    sm: { height: 36 },
    md: { height: 52 },
    lg: { height: 64 },
    text: { fontWeight: '700', textAlign: 'center' },
    text_sm: { fontSize: 14 },
    text_md: { fontSize: 16 },
    text_lg: { fontSize: 18 },
});

export default AppButton;