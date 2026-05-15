import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

export const CreateFeedScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState('');
    const [videoUri, setVideoUri] = useState<string | null>(null);

    const handlePublish = () => {
        // Publish logic here
        console.log('Publishing Feed...', { caption, tags, videoUri });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => {/* navigation.goBack() */ }}>
                    <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>New Feed</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    {/* Upload Video Section */}
                    <Text style={[styles.label, { color: colors.textSecondary }]}>UPLOAD VIDEO</Text>
                    {videoUri ? (
                        <View style={styles.previewContainer}>
                            <Image source={{ uri: videoUri }} style={styles.videoPreview} />
                            <TouchableOpacity style={styles.removeBtn} onPress={() => setVideoUri(null)}>
                                <AppIcon library="Feather" name="trash-2" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => setVideoUri('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400')} // Mocking an upload
                        >
                            <AppIcon library="Feather" name="video" size={32} color={colors.textSecondary} style={{ marginBottom: 12 }} />
                            <Text style={[styles.uploadText, { color: colors.text }]}>Tap to select video</Text>
                            <Text style={[styles.uploadSubText, { color: colors.textSecondary }]}>MP4 or MOV, max 60s</Text>
                        </TouchableOpacity>
                    )}

                    {/* Caption */}
                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 24 }]}>CAPTION</Text>
                    <TextInput
                        style={[styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                        placeholder="Write a catchy caption..."
                        placeholderTextColor={colors.textSecondary}
                        multiline
                        textAlignVertical="top"
                        value={caption}
                        onChangeText={setCaption}
                    />

                    {/* Tags */}
                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 24 }]}>HASHTAGS</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                        placeholder="e.g. #FreshCut #BarberShop"
                        placeholderTextColor={colors.textSecondary}
                        value={tags}
                        onChangeText={setTags}
                    />

                    {/* Link Product/Service */}
                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: 24 }]}>LINK A SERVICE OR PRODUCT (OPTIONAL)</Text>
                    <TouchableOpacity style={[styles.linkBtn, { borderColor: colors.border }]}>
                        <AppIcon library="Feather" name="link" size={18} color={colors.textSecondary} />
                        <Text style={[styles.linkText, { color: colors.text }]}>Select item from store...</Text>
                        <AppIcon library="Feather" name="chevron-right" size={18} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>

            <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
                <TouchableOpacity style={[styles.publishBtn, { backgroundColor: colors.primary }]} onPress={handlePublish}>
                    <AppIcon library="Feather" name="send" size={18} color="#FFF" />
                    <Text style={styles.publishBtnText}>Publish Feed</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },
    content: { padding: 20 },

    label: { fontSize: 11, fontWeight: '800', marginBottom: 8, letterSpacing: 0.5 },

    uploadBox: { height: 200, borderWidth: 1, borderStyle: 'dashed', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    uploadText: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    uploadSubText: { fontSize: 12 },

    previewContainer: { height: 300, width: '60%', alignSelf: 'center', borderRadius: 16, overflow: 'hidden', position: 'relative' },
    videoPreview: { width: '100%', height: '100%' },
    removeBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(239, 68, 68, 0.9)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

    textArea: { height: 100, borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 15 },
    input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },

    linkBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', gap: 12 },
    linkText: { fontSize: 14, fontWeight: '600' },

    footer: { padding: 20, paddingBottom: 34, borderTopWidth: 1 },
    publishBtn: { flexDirection: 'row', height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 10 },
    publishBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});