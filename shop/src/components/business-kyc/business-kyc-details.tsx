import CountryPicker from "@avaiyakapil/react-native-country-picker";
import { Input } from "@components/ui";
import { useTheme } from "@contexts/ThemeContext";
import { useRegistrationStore } from "@store/useRegistrationStore";
import { BusinessCategory } from "@type/business-kyc";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RenderCountryButton from "./RenderCountryButton";

const BUSINESS_CATEGORIES: BusinessCategory[] = ['Beauty', 'Food', 'Fashion', 'Events', 'Services', 'Other'];

const BusinessKycDetails = () => {
    const { colors, spacing } = useTheme();
    const {businessAddress,businessCategory , businessCountryCode , businessName , businessPhoneCountryCode , contactEmail , contactPhone , taxRegistrationNumber ,setBusinessAddress , setBusinessName , setBusinessCategory , setBusinessCountryCode , setBusinessPhoneCountryCode , setContactEmail , setContactPhone , setTaxRegistrationNumber } = useRegistrationStore()
    return (
        <View style={styles.section}>
            <Input label="Business name" inputStyle={{ color: colors.text }} value={businessName} onChangeText={setBusinessName} placeholder="Enter legal business name" />_
            <Text style={[styles.label, { color: colors.text }]}>Business country</Text>
            <CountryPicker
                colors={{
                    grayLight: colors.border,
                    grayBackground: colors.background,
                    white: colors.border,
                    gray: colors.textSecondary,
                    dark: colors.text,
                }}
                iconColor={colors.text}
                countryCode={businessCountryCode}
                showCallingCode={false}
                showCountryName
                showFlag
                containerStyle={styles.countryPickerButton}
                renderSelectedCountry={RenderCountryButton}
                onSelect={setBusinessCountryCode}
            />

            <Text style={[styles.label, { color: colors.text }]}>Business category</Text>
            <View style={styles.categoryRow}>
                {BUSINESS_CATEGORIES.map((category) => {
                    const active = businessCategory === category;
                    return (
                        <TouchableOpacity
                            key={category}
                            onPress={() => setBusinessCategory(category)}
                            style={[
                                styles.categoryChip,
                                {
                                    backgroundColor: active ? colors.primary : colors.surface,
                                    borderColor: active ? colors.primary : colors.border,
                                },
                            ]}
                        >
                            <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '700' }}>{category}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.phoneRow}>
                <View style={{ width: 110 }}>
                    <Text style={[styles.label, { color: colors.text }]}>Business phone</Text>
                    <CountryPicker
                        colors={{
                            grayLight: colors.border,
                            grayBackground: colors.background,
                            white: colors.border,
                            gray: colors.textSecondary,
                            dark: colors.text,
                        }}
                        iconColor={colors.text}
                        countryCode={businessPhoneCountryCode}
                        showCountryName={false}
                        showCallingCode
                        showFlag
                        containerStyle={styles.countryPickerButton}
                        onSelect={(country) => {
                            // country.cca2 is 'NG', 'US', etc.
                            setBusinessPhoneCountryCode(country);

                            // // country.callingCode is an array, e.g., ['234']
                            // if (country.callingCode && country.callingCode.length > 0) {
                            //     setPhoneCallingCode(country.callingCode[0]);
                            // }
                        }}
                    />
                </View>
                <View style={{ width: spacing(1.5) }} />
                <View style={{ flex: 1 }}>
                    <Input label=" " keyboardType="phone-pad" inputStyle={{ color: colors.text }} value={contactPhone} onChangeText={setContactPhone} placeholder="Enter business phone" />
                </View>
            </View>
            <Input label="Business email" keyboardType="email-address" autoCapitalize="none" inputStyle={{ color: colors.text }} value={contactEmail} onChangeText={setContactEmail} placeholder="Enter business email" />
            <Input label="Business address" inputStyle={{ color: colors.text }} value={businessAddress} onChangeText={setBusinessAddress} placeholder="Enter business address" />
            <Input label="Tax or registration number" inputStyle={{ color: colors.text }} value={taxRegistrationNumber} onChangeText={setTaxRegistrationNumber} placeholder="Enter tax or registration number" />
        </View>
    );
}

export default BusinessKycDetails;

const styles = StyleSheet.create({
    section: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
    phoneRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
    categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
    categoryChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
    countryPickerButton: { width: '100%' },
})