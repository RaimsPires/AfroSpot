import { AppIcon } from "@components/ui";
import { useTheme } from "@contexts/ThemeContext";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BusinessKYCHeader = ({ currentStep, setCurrentStep }: { currentStep: 1 | 2; setCurrentStep: (step: 1 | 2) => void }) => {
    const { colors } = useTheme();
    return (
        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            {currentStep === 2 && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setCurrentStep(1)}
                >
                    <AppIcon library="Feather" name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
            )}
            <View>
                <Text style={[styles.stepText, { color: colors.primary }]}>
                    Step 2 of 3 • {currentStep === 1 ? 'Details' : 'Uploads'}
                </Text>
                <Text style={[styles.title, { color: colors.text }]}>
                    {currentStep === 1 ? 'Register your business' : 'Visual Identity'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {currentStep === 1 ? 'A few details to complete your business KYC.' : 'Upload your brand visuals and legal document.'}
                </Text>
            </View>
        </View>
    );
};


export default BusinessKYCHeader;

const styles = StyleSheet.create({
    header: { padding: 24, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'flex-start' },
    backButton: { position: 'absolute', left: 24, top: 24, padding: 8 },
    stepText: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
    subtitle: { fontSize: 14, fontWeight: '400' }
});