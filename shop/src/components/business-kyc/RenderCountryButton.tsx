import { Country } from "@avaiyakapil/react-native-country-picker";
import { useTheme } from "@contexts/ThemeContext";
import { Image, StyleSheet, Text, View } from "react-native";

const RenderCountryButton = (country: Country) => {
const { colors } = useTheme();
    return (
        <View style={styles.selectedCountryRow}>
            <Image source={{ uri: country.flag }} style={styles.selectedCountryFlag} />
            <Text style={[styles.selectedCountryName, { color: colors.text }]} numberOfLines={1}>
                {country.name?.common}
            </Text>
        </View>
    );

}

export default RenderCountryButton;

const styles = StyleSheet.create({
    selectedCountryRow: { width: '100%', flexDirection: 'row', alignItems: 'center' },
    selectedCountryFlag: { width: 24, height: 24, borderRadius: 12, marginRight: 10 },
    selectedCountryName: { flex: 1, fontSize: 14, fontWeight: '600' },
})