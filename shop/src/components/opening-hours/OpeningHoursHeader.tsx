import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OpeningHoursHeader: React.FC<{ handleOpenModal: () => void }> = ({ handleOpenModal }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    return (
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity style={styles.iconBtn}
                onPress={() => navigation.goBack()}
            >
                <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Operating Hours</Text>
            <TouchableOpacity style={styles.iconBtn} onPress={() => handleOpenModal()}>
                <AppIcon library="Feather" name="plus" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
    )
}

export default OpeningHoursHeader

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },
})