import { AppIcon } from "@components/ui";
import { useTheme } from "@contexts/ThemeContext";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const UploadCard = ({ title, helper, file, onPress, icon }: any) => {
const { colors } = useTheme();
    return (
        <TouchableOpacity onPress={onPress} style={[styles.uploadBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            {file ? (
                <View style={styles.uploadFilledState}>
                    <Image source={{ uri: file.path }} style={styles.uploadPreview} />
                    <View style={styles.uploadInfo}>
                        <Text style={[styles.uploadTitle, { color: colors.text }]}>{title}</Text>
                        <Text style={[styles.uploadHelper, { color: colors.textSecondary }]} numberOfLines={1}>{file.fileName}</Text>
                    </View>
                    <AppIcon library="Feather" name="check-circle" size={20} color={colors.success} />
                </View>
            ) : (
                <View style={styles.uploadPlaceholder}>
                    <AppIcon library="Feather" name={icon} size={22} color={colors.primary} />
                    <Text style={[styles.uploadTitle, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.uploadHelper, { color: colors.textSecondary }]}>{helper}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}


export default UploadCard;
const styles = StyleSheet.create({
    uploadBox: { height: 130, borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, justifyContent: 'center', marginBottom: 12, overflow: 'hidden' },
    uploadPlaceholder: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    uploadFilledState: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 12 },
    uploadPreview: { width: 72, height: 72, borderRadius: 10 },
    uploadInfo: { flex: 1 },
    uploadTitle: { marginTop: 10, fontWeight: '700', fontSize: 14 },
    uploadHelper: { marginTop: 4, fontSize: 12 },
}); 