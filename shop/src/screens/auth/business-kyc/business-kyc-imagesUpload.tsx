import { UploadState } from "@type/business-kyc";
import { StyleSheet, View } from "react-native";
import UploadCard from "./UploadCard";

const BusinessKycImagesUpload = ({ uploads, pickBannerImage, pickProfileImage, pickDocumentImage }: { uploads: UploadState; pickBannerImage: () => void; pickProfileImage: () => void; pickDocumentImage: () => void }) => {
    return (
        <View style={styles.section}>
            <UploadCard title="Business banner image" helper="Tap to upload banner" file={uploads.banner} onPress={pickBannerImage} icon="image" />
            <UploadCard title="Business profile image" helper="Tap to upload logo" file={uploads.profile} onPress={pickProfileImage} icon="user" />
            <UploadCard title="ID or business document" helper="Tap to upload document" file={uploads.document} onPress={pickDocumentImage} icon="file-text" />
        </View>
    );
}

export default BusinessKycImagesUpload;
const styles = StyleSheet.create({
    section: { marginBottom: 20 },
})   