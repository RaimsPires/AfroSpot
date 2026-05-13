import React, { forwardRef, useMemo, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import { useTheme } from '@/context/ThemeContext';

import { InputProps } from '@/types/ui';
import CustomIcon from './AppIcon';


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
}: InputProps, ref) {
    const { theme } = useTheme();
    const [isSecureVisible, setIsSecureVisible] = useState(false);

    const shouldShowSecureToggle = useMemo(
        () => Boolean(secureTextEntry && secureToggleEnabled),
        [secureTextEntry, secureToggleEnabled],
    );

    const resolvedSecureTextEntry = shouldShowSecureToggle ? !isSecureVisible : secureTextEntry;

    return (
        <View style={[styles.container, containerStyle]}>
            {label ? <Text style={[styles.label, { color: theme.text }, labelStyle]}>{label}</Text> : null}

            <View
                style={[
                    styles.wrapper,
                    {
                        backgroundColor: theme.card,
                        borderColor: error ? theme.destructive : theme.border,
                    },
                    inputWrapperStyle,
                ]}
            >
                {leftElement ??
                    (leftIcon ? (
                        <CustomIcon
                            library={leftIcon.library}
                            name={leftIcon.name}
                            size={leftIcon.size ?? 18}
                            color={leftIcon.color ?? theme.textMuted}
                            style={styles.leftIcon}
                        />
                    ) : null)}

                <TextInput
                    ref={ref}
                    {...props}
                    editable={editable}
                    secureTextEntry={resolvedSecureTextEntry}
                    placeholderTextColor={theme.textMuted}
                    style={[styles.input, { color: theme.text }, inputStyle]}
                />

                {shouldShowSecureToggle ? (
                    <Pressable
                        onPress={() => setIsSecureVisible((prev) => !prev)}
                        hitSlop={10}
                        disabled={!editable}
                        style={styles.iconAction}
                    >
                        <CustomIcon
                            library={secureIconLibrary}
                            name={isSecureVisible ? secureHideIconName : secureShowIconName}
                            size={18}
                            color={theme.textMuted}
                        />
                    </Pressable>
                ) : rightElement ?? rightIcon ? (
                    rightElement ?? (
                        <CustomIcon
                            library={rightIcon?.library}
                            name={rightIcon?.name ?? 'circle'}
                            size={rightIcon?.size ?? 18}
                            color={rightIcon?.color ?? theme.textMuted}
                            style={styles.rightIcon}
                        />
                    )
                ) : null}
            </View>

            {error ? (
                <Text style={[styles.helper, { color: theme.destructive }, helperStyle]}>{error}</Text>
            ) : helperText ? (
                <Text style={[styles.helper, { color: theme.textMuted }, helperStyle]}>{helperText}</Text>
            ) : null}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    wrapper: {
        minHeight: 48,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 10,
    },
    leftIcon: {
        marginRight: 2,
    },
    rightIcon: {
        marginLeft: 2,
    },
    iconAction: {
        padding: 2,
    },
    helper: {
        fontSize: 12,
    },
});

export default Input;