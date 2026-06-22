import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { FeedCommentData } from '@type/feed';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

type CommentsBottomSheetProps = {
  comments?: FeedCommentData[];
  commentCountLabel?: number | string;
  onClose?: () => void;
  onSubmitComment?: (text: string, parentId?: string) => Promise<void>;
};

export const CommentsBottomSheet = ({ comments = [], commentCountLabel, onClose, onSubmitComment }: CommentsBottomSheetProps) => {
  const { colors } = useTheme();

  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<FeedCommentData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = (selectedComment: FeedCommentData) => {
    setReplyingTo(selectedComment);
  };

  const clearReply = () => {
    setReplyingTo(null);
  };

  const handleSend = async () => {
    console.log("pressed");

    const trimmed = commentText.trim();
    console.log(trimmed);

    if (!trimmed || !onSubmitComment) return;

    setIsSubmitting(true);
    try {
      // Send the text and the parent ID to the backend
      await onSubmitComment(trimmed, replyingTo?.id);

      // Clear input on success
      setCommentText('');
      setReplyingTo(null);
    } catch (error) {
      console.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format the Django ISO date string nicely
  const formatTime = (dateString: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // 🚀 Extracted Comment Row to handle both top-level and replies easily
  const CommentRow = ({ c, isReply = false }: { c: FeedCommentData, isReply?: boolean }) => (
    <View style={[styles.commentRow, isReply && styles.replyIndent]}>
      <Image source={{ uri: c.avatar || 'https://via.placeholder.com/150' }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <Text style={[styles.username, { color: colors.textSecondary }]}>
          {c.user_name || c.user_username} <Text style={styles.time}>{formatTime(c.created_at)}</Text>
        </Text>
        <Text style={[styles.commentText, { color: colors.text }]}>{c.text}</Text>

        {/* Only allow replying to top-level comments to keep nesting clean (Optional) */}
        {!isReply && (
          <TouchableOpacity onPress={() => handleReply(c)}>
            <Text style={[styles.replyText, { color: colors.textSecondary }]}>Reply</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.likeCol}>
        <AppIcon library="EvilIcons" name="heart" size={14} color={colors.textSecondary} />
        <Text style={[styles.likeCount, { color: colors.textSecondary }]}>0</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.sheet, { backgroundColor: colors.background }]}>

        {/* Header */}
        <View style={[styles.sheetHeader, { borderBottomColor: colors.divider }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Comments ({commentCountLabel || comments.length})</Text>
          <TouchableOpacity onPress={onClose}>
            <AppIcon library="Feather" name="x" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* 🚀 Comment List (Handles nested replies) */}
        <ScrollView contentContainerStyle={styles.commentList}>
          {comments.map(c => (
            <View key={c.id}>
              {/* Parent Comment */}
              <CommentRow c={c} />

              {/* Nested Replies */}
              {c.replies && c.replies.length > 0 && (
                <View style={[styles.repliesContainer, { borderLeftColor: colors.border }]}>
                  {c.replies.map(reply => (
                    <CommentRow key={reply.id} c={reply} isReply={true} />
                  ))}
                </View>
              )}
            </View>
          ))}
          {comments.length === 0 && (
            <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 20 }}>No comments yet. Be the first!</Text>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputRow, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
          {replyingTo ? (
            <View style={[styles.replyChip, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[styles.replyChipText, { color: colors.primary }]}>Replying to @{replyingTo.user_username}</Text>
              <TouchableOpacity onPress={clearReply}>
                <AppIcon library="Feather" name="x" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.inputInnerRow}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={replyingTo ? `Reply to @${replyingTo.user_username}...` : 'Add a comment...'}
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              disabled={!commentText.trim() || isSubmitting}
              style={{ opacity: commentText.trim() ? 1 : 0.5 }}
              onPress={handleSend}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <AppIcon library="Feather" name="send" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: { height: '80%', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800' },

  commentList: { padding: 20, gap: 20, paddingBottom: 40 },
  commentRow: { flexDirection: 'row', marginBottom: 16 },

  // 🚀 New Styles for Replies
  repliesContainer: { marginLeft: 18, paddingLeft: 16, borderLeftWidth: 1 },
  replyIndent: { marginTop: 8, marginBottom: 8 },

  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  commentContent: { flex: 1 },
  username: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  time: { fontWeight: '400', opacity: 0.7, marginLeft: 6, fontSize: 10 },
  commentText: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  replyText: { fontSize: 12, fontWeight: '700' },
  likeCol: { alignItems: 'center', marginLeft: 12 },
  likeCount: { fontSize: 11, marginTop: 4 },

  inputRow: { paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, paddingBottom: Platform.OS === 'ios' ? 30 : 12 },
  replyChip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginBottom: 8, gap: 8 },
  replyChipText: { fontSize: 12, fontWeight: '700' },
  inputInnerRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, height: 40, fontSize: 15, marginRight: 12 },
});