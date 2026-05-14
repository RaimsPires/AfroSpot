import { FeedComment, FeedPostItem } from '@/components/feeds/types';
import { AppIcon } from "@/components/ui";
import { useState } from "react";
import { FlatList, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

type CommentsBottomSheetProps = {
    visible: boolean;
    post: FeedPostItem | null;
    comments: FeedComment[];
    onAddComment: (content: string) => void;
    onClose: () => void;
    onOpenBusiness: () => void;
    colors: {
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        primary: string;
    };
};


const CommentsBottomSheet = ({
    visible,
    post,
    comments,
    onAddComment,
    onClose,
    onOpenBusiness,
    colors,
}: CommentsBottomSheetProps) => {
    const [draft, setDraft] = useState('');

    const handleSend = () => {
        if (!draft.trim()) {
            return;
        }
        onAddComment(draft);
        setDraft('');
        Keyboard.dismiss();
    };

    const handleOpenBusiness = () => {
        onOpenBusiness();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <Pressable style={styles.sheetBackdrop} onPress={onClose} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
                style={styles.sheetKeyboardWrap}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={[styles.sheetContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}> 
                        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

                    <View style={styles.sheetHeader}>
                        <Text style={[styles.sheetTitle, { color: colors.text }]}>Comments</Text>
                        <TouchableOpacity onPress={onClose}>
                            <AppIcon library="Feather" name="x" size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    {post ? (
                        <Text style={[styles.sheetSubtitle, { color: colors.textSecondary }]}>@{post.username} · {post.businessName}</Text>
                    ) : null}

                        <FlatList
                            data={comments}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.commentsContent}
                            showsVerticalScrollIndicator={false}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                            onScrollBeginDrag={Keyboard.dismiss}
                            ListEmptyComponent={
                                <View style={styles.emptyCommentsWrap}>
                                    <Text style={[styles.emptyCommentsText, { color: colors.textSecondary }]}>No comments yet. Be the first to comment.</Text>
                                </View>
                            }
                            renderItem={({ item }) => (
                                <View style={[styles.commentRow, { borderBottomColor: colors.border }]}> 
                                    <TouchableOpacity style={styles.commentAvatarButton} onPress={handleOpenBusiness} activeOpacity={0.8}>
                                        <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
                                    </TouchableOpacity>
                                    <View style={styles.commentBody}>
                                        <View style={styles.commentMetaRow}>
                                            <TouchableOpacity onPress={handleOpenBusiness}>
                                                <Text style={[styles.commentUser, { color: colors.text }]}>@{item.username}</Text>
                                            </TouchableOpacity>
                                            <Text style={[styles.commentTime, { color: colors.textSecondary }]}>{item.createdAt}</Text>
                                        </View>
                                        <Text style={[styles.commentContent, { color: colors.text }]}>{item.content}</Text>
                                    </View>
                                </View>
                            )}
                        />

                        <View style={[styles.composerRow, { borderTopColor: colors.border, backgroundColor: colors.surface }]}> 
                            <TextInput
                                style={[styles.composerInput, { color: colors.text }]}
                                placeholder="Add a comment..."
                                placeholderTextColor={colors.textSecondary}
                                value={draft}
                                onChangeText={setDraft}
                            />
                            <TouchableOpacity
                                style={[styles.sendButton, { backgroundColor: colors.primary }]}
                                onPress={handleSend}
                            >
                                <AppIcon library="Feather" name="send" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CommentsBottomSheet;

const styles = StyleSheet.create({
    sheetContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#CCC',
        alignSelf: 'center',
        marginBottom: 12,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    sheetSubtitle: {
        fontSize: 14,
        marginTop: 4,
        marginBottom: 12,
    },
    commentsContent: {
        paddingBottom: 12,
    },
    commentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    commentAvatarButton: {
        marginRight: 12,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 12,
    },
    commentBody: {
        flex: 1,
    },
    commentMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    commentUser: {
        fontWeight: '600',
    },
    commentTime: {
        fontSize: 12,
    },
    commentContent: {
        fontSize: 14,
    },
    composerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        gap: 8,
    },
    composerInput: {
        flex: 1,
        fontSize: 14,
    },
    sendButton: {
        padding: 8,
        borderRadius: 8,
    },
    sheetBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheetKeyboardWrap: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    emptyCommentsWrap: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyCommentsText: {
        fontSize: 14,
    },
});