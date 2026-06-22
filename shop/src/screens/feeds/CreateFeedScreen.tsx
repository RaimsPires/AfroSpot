import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video, { ViewType } from 'react-native-video';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { feedService } from '@services/feedService';

const CreateFeedScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState('');
    const [videoAsset, setVideoAsset] = useState<Asset | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const pickVideo = async () => {
        const result = await launchImageLibrary({ mediaType: 'video', selectionLimit: 1 });
        console.log(result);

        if (!result.didCancel && result.assets) setVideoAsset(result.assets[0]);
    };

    const togglePlayPause = () => {
        setIsPaused(prevState => !prevState);
    };
    const handlePublish = async () => {
        if (!videoAsset) {
            Alert.alert("Missing Video", "Please select a video to post.");
            return;
        }

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('caption', caption);
            formData.append('hashtags', tags);
            formData.append('video_file', {
                uri: videoAsset.uri,
                type: videoAsset.type || 'video/mp4',
                name: videoAsset.fileName || 'feed_video.mp4'
            } as any);

            await feedService.createFeed(formData);
            Alert.alert("Success", "Feed published!", [{ text: "OK", onPress: () => navigation.goBack() }]);
        } catch {
            Alert.alert("Error", "Could not publish feed.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>New Feed</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>UPLOAD VIDEO</Text>
                    {videoAsset ? (
                        <View style={styles.previewContainer}>
                            {/* 🚀 Real Video Preview */}
                            <Pressable style={styles.videoContainer} onPress={togglePlayPause}>
                                <Video
                                    source={{ uri: videoAsset.uri }}
                                    style={StyleSheet.absoluteFill}
                                    resizeMode="cover"
                                    repeat={true}
                                    muted={true}
                                    viewType={ViewType.TEXTURE}
                                    disableFocus={true}
                                    // 4. Pass the state to the paused prop
                                    paused={isPaused}
                                />

                                {/* Optional: Add a UI indicator when the video is paused */}
                                {isPaused && (
                                    <View style={styles.overlay}>
                                        <Text style={styles.playIcon}>▶️</Text>
                                    </View>
                                )}
                            </Pressable>
                            {/* Dark gradient for text readability */}
                            <View style={{ ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.3)' }} />

                            <View style={styles.previewOverlay}>
                                <Text style={styles.previewCaption} numberOfLines={2}>{caption || "Your caption..."}</Text>
                                <Text style={styles.previewTags}>{tags}</Text>
                            </View>
                            <TouchableOpacity style={[styles.removeBtn, { backgroundColor: colors.destructive }]} onPress={() => setVideoAsset(null)}>
                                <AppIcon library="Feather" name="trash-2" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={pickVideo}>
                            <AppIcon library="Feather" name="video" size={32} color={colors.textSecondary} style={{ marginBottom: 12 }} />
                            <Text style={[styles.uploadText, { color: colors.text }]}>Tap to select video</Text>
                        </TouchableOpacity>
                    )}

                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 24 }]}>CAPTION</Text>
                    <TextInput style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} multiline value={caption} onChangeText={setCaption} />

                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 24 }]}>HASHTAGS</Text>
                    <TextInput style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} value={tags} onChangeText={setTags} />
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                <TouchableOpacity style={[styles.publishBtn, { backgroundColor: colors.primary }]} onPress={handlePublish} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.publishBtnText, { color: colors.textInverse }]}>Publish Feed</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CreateFeedScreen

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },
    content: { padding: 20 },
    label: { fontSize: 11, fontWeight: '800', marginBottom: 8, letterSpacing: 0.5 },
    uploadBox: { height: 200, borderWidth: 1, borderStyle: 'dashed', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    uploadText: { fontSize: 15, fontWeight: '700' },
    previewContainer: { height: 350, width: '70%', alignSelf: 'center', borderRadius: 16, overflow: 'hidden', position: 'relative' },
    videoContainer: { flex: 1, },
    overlay: {...StyleSheet.absoluteFill,justifyContent: 'center', alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.3)',},
    playIcon: {fontSize: 50,color: 'white',},
    previewOverlay: { position: 'absolute', bottom: 20, left: 20, right: 20 },
    previewCaption: { color: 'white', fontWeight: '800', fontSize: 16, textShadowColor: 'black', textShadowRadius: 4 },
    previewTags: { color: '#00D1FF', fontWeight: '700', fontSize: 14, marginTop: 4 },
    removeBtn: { position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    textArea: { height: 100, borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 15 },
    input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    footer: { padding: 20, paddingBottom: 34, borderTopWidth: 1 },
    publishBtn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    publishBtnText: { fontSize: 16, fontWeight: '800' },
});