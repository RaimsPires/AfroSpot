import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video, { ViewType } from 'react-native-video';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { feedService } from '@services/feedService';

const CreateFeedScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();
    
    // Form State
    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState('');
    
    // Media State
    const [videoAsset, setVideoAsset] = useState<Asset | null>(null);
    const [coverAsset, setCoverAsset] = useState<Asset | null>(null);
    
    // UI State
    const [isSaving, setIsSaving] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const pickVideo = async () => {
        const result = await launchImageLibrary({ mediaType: 'video', selectionLimit: 1 });
        if (!result.didCancel && result.assets) {
            setVideoAsset(result.assets[0]);
        }
    };

    const pickCover = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
        if (!result.didCancel && result.assets) {
            setCoverAsset(result.assets[0]);
        }
    };

    const togglePlayPause = () => {
        setIsPaused(prevState => !prevState);
    };

    const handleClearMedia = () => {
        setVideoAsset(null);
        setCoverAsset(null);
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

            if (coverAsset) {
                formData.append('video_cover', {
                    uri: coverAsset.uri,
                    type: coverAsset.type || 'image/jpeg',
                    name: coverAsset.fileName || 'cover.jpg'
                } as any);
            }

            await feedService.createFeed(formData);
            Alert.alert("Success", "Feed published!", [{ text: "OK", onPress: () => navigation.goBack() }]);
        } catch (error: any) {
            console.log(error?.response?.data || error);
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
                    
                    {/* --- 1. MEDIA PICKERS --- */}
                    <Text style={[styles.label, { color: colors.textSecondary }]}>SELECT MEDIA</Text>
                    <View style={styles.mediaRow}>
                        {/* Video Picker */}
                        <TouchableOpacity style={[styles.mediaBox, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={pickVideo}>
                            {videoAsset ? (
                                <Text style={[styles.mediaSelectedText, { color: colors.primary }]}>Video Added</Text>
                            ) : (
                                <>
                                    <AppIcon library="Feather" name="video" size={24} color={colors.textSecondary} style={{ marginBottom: 4 }} />
                                    <Text style={{ fontSize: 10, color: colors.textSecondary }}>Add Video</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Cover Picker */}
                        <TouchableOpacity style={[styles.mediaBox, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={pickCover}>
                            {coverAsset ? (
                                <Text style={[styles.mediaSelectedText, { color: colors.primary }]}>Cover Added</Text>
                            ) : (
                                <>
                                    <AppIcon library="Feather" name="image" size={24} color={colors.textSecondary} style={{ marginBottom: 4 }} />
                                    <Text style={{ fontSize: 10, color: colors.textSecondary }}>Add Cover</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* --- 2. LIVE PREVIEW --- */}
                    {videoAsset && (
                        <View style={styles.previewContainer}>
                            <Pressable style={styles.videoContainer} onPress={togglePlayPause}>
                                <Video
                                    source={{ uri: videoAsset.uri }}
                                    style={StyleSheet.absoluteFill}
                                    resizeMode="cover"
                                    repeat={true}
                                    viewType={ViewType.TEXTURE}
                                    disableFocus={true}
                                    paused={isPaused}
                                />
                            </Pressable>
                            
                            {/* Dark gradient for text readability */}
                            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)' }]} pointerEvents="none" />

                            {/* 🚀 CENTERED PLAY ICON */}
                            {isPaused && (
                                <View style={styles.centerOverlay} pointerEvents="none">
                                    <AppIcon library="Feather" name="play-circle" size={60} color="rgba(255,255,255,0.8)" />
                                </View>
                            )}

                            {/* Bottom Caption/Tags */}
                            <View pointerEvents="none" style={styles.previewOverlay}>
                                <Text style={styles.previewCaption} numberOfLines={2}>{caption || "Your caption..."}</Text>
                                <Text style={styles.previewTags}>{tags}</Text>
                            </View>

                            {/* Small Cover Thumbnail Preview in the top left */}
                            {coverAsset && (
                                <View style={styles.coverThumbnailWrapper}>
                                    <Image source={{ uri: coverAsset.uri }} style={styles.coverThumbnail} />
                                    <Text style={styles.coverLabel}>Cover</Text>
                                </View>
                            )}

                            {/* Delete Button */}
                            <TouchableOpacity style={[styles.removeBtn, { backgroundColor: colors.destructive }]} onPress={handleClearMedia}>
                                <AppIcon library="Feather" name="trash-2" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* --- 3. FORM INPUTS --- */}
                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 24 }]}>CAPTION</Text>
                    <TextInput 
                        style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} 
                        multiline 
                        value={caption} 
                        onChangeText={setCaption} 
                    />

                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 24 }]}>HASHTAGS</Text>
                    <TextInput 
                        style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]} 
                        value={tags} 
                        onChangeText={setTags} 
                    />
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

export default CreateFeedScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },
    content: { padding: 20 },
    
    label: { fontSize: 11, fontWeight: '800', marginBottom: 8, letterSpacing: 0.5 },
    
    mediaRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    mediaBox: { 
        width: 100, 
        height: 100, 
        borderRadius: 12, 
        borderWidth: 1, 
        borderStyle: 'dashed', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 8
    },
    mediaSelectedText: { fontSize: 12, fontWeight: '700', textAlign: 'center' },

    previewContainer: { height: 350, width: '70%', alignSelf: 'center', borderRadius: 16, overflow: 'hidden', position: 'relative' },
    videoContainer: { flex: 1 },
    
    // 🚀 NEW: Absolute center overlay for the play button
    centerOverlay: { ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', zIndex: 5 },
    
    previewOverlay: { position: 'absolute', bottom: 20, left: 20, right: 20, zIndex: 5 },
    previewCaption: { color: 'white', fontWeight: '800', fontSize: 16, textShadowColor: 'black', textShadowRadius: 4 },
    previewTags: { color: '#00D1FF', fontWeight: '700', fontSize: 14, marginTop: 4, textShadowColor: 'black', textShadowRadius: 4 },
    
    coverThumbnailWrapper: { position: 'absolute', top: 12, left: 12, borderWidth: 1, borderColor: '#FFF', borderRadius: 6, overflow: 'hidden', zIndex: 10 },
    coverThumbnail: { width: 44, height: 44 },
    coverLabel: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF', fontSize: 8, textAlign: 'center', paddingVertical: 2, fontWeight: '700' },

    removeBtn: { position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    
    textArea: { height: 100, borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 15, textAlignVertical: 'top' },
    input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
    
    footer: { padding: 20, paddingBottom: 34, borderTopWidth: 1 },
    publishBtn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    publishBtnText: { fontSize: 16, fontWeight: '800' },
});