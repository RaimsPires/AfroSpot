import React, { forwardRef, useMemo, useState } from 'react';
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';
import AppIcon from './AppIcon';


interface InputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
    label?: string;
    helperText?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputWrapperStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    helperStyle?: StyleProp<TextStyle>;
    leftIcon?: { library: any; name: string; size?: number; color?: string };
    rightIcon?: { library: any; name: string; size?: number; color?: string };
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
    secureToggleEnabled?: boolean;
    secureShowIconName?: string;
    secureHideIconName?: string;
    secureIconLibrary?: any;
}

export const Input = forwardRef<TextInput, InputProps>(function Input({
    label,
    helperText,
    error,
    containerStyle,
    inputWrapperStyle,
    inputStyle,
    labelStyle,
    helperStyle,
    leftIcon,
    rightIcon,
    leftElement,
    rightElement,
    secureTextEntry,
    secureToggleEnabled = true,
    secureShowIconName = 'eye',
    secureHideIconName = 'eye-off',
    secureIconLibrary = 'Feather',
    editable = true,
    ...props
}, ref) {
    // Accessing our dynamic colors and spacing
    const { colors, spacing } = useTheme();
    const [isSecureVisible, setIsSecureVisible] = useState(false);

    const shouldShowSecureToggle = useMemo(
        () => Boolean(secureTextEntry && secureToggleEnabled),
        [secureTextEntry, secureToggleEnabled],
    );

    const resolvedSecureTextEntry = shouldShowSecureToggle ? !isSecureVisible : secureTextEntry;

    return (
        <View style={[styles.container, { gap: spacing(1) }, containerStyle]}>
            {/* Label */}
            {label ? (
                <Text style={[styles.label, { color: colors.text }, labelStyle]}>
                    {label}
                </Text>
            ) : null}

            {/* Input Wrapper */}
            <View
                style={[
                    styles.wrapper,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error ? colors.error : colors.border,
                        paddingHorizontal: spacing(1.5),
                        height: spacing(6), // Standardized height
                    },
                    inputWrapperStyle,
                ]}
            >
                {/* Left Side Content */}
                {leftElement ??
                    (leftIcon ? (
                        <AppIcon
                            library={leftIcon.library}
                            name={leftIcon.name}
                            size={leftIcon.size ?? 18}
                            color={leftIcon.color ?? colors.textSecondary}
                            style={styles.leftIcon}
                        />
                    ) : null)}

                {/* Main TextInput */}
                <TextInput
                    ref={ref}
                    {...props}
                    editable={editable}
                    secureTextEntry={resolvedSecureTextEntry}
                    placeholderTextColor={colors.textSecondary}
                    style={[
                        styles.input, 
                        { color: colors.text, paddingVertical: spacing(1) }, 
                        inputStyle
                    ]}
                />

                {/* Right Side Content (Secure Toggle or Icons) */}
                {shouldShowSecureToggle ? (
                    <Pressable
                        onPress={() => setIsSecureVisible((prev) => !prev)}
                        hitSlop={10}
                        disabled={!editable}
                        style={styles.iconAction}
                    >
                        <AppIcon
                            library={secureIconLibrary}
                            name={isSecureVisible ? secureHideIconName : secureShowIconName}
                            size={18}
                            color={colors.textSecondary}
                        />
                    </Pressable>
                ) : rightElement ?? rightIcon ? (
                    rightElement ?? (
                        <AppIcon
                            library={rightIcon?.library}
                            name={rightIcon?.name ?? 'circle'}
                            size={rightIcon?.size ?? 18}
                            color={rightIcon?.color ?? colors.textSecondary}
                            style={styles.rightIcon}
                        />
                    )
                ) : null}
            </View>

            {/* Error or Helper Text */}
            {error ? (
                <Text style={[styles.helper, { color: colors.error }, helperStyle]}>
                    {error}
                </Text>
            ) : helperText ? (
                <Text style={[styles.helper, { color: colors.textSecondary }, helperStyle]}>
                    {helperText}
                </Text>
            ) : null}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    wrapper: {
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 15,
    },
    leftIcon: {
        marginRight: 4,
    },
    rightIcon: {
        marginLeft: 4,
    },
    iconAction: {
        padding: 4,
    },
    helper: {
        fontSize: 12,
        marginTop: 2,
    },
});

export default Input;