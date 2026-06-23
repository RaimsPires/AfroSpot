import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { feedService } from '@services/feedService';
import { FeedCommentData } from '@type/feed';

type CommentsBottomSheetProps = {
  feedId: string;
  commentCountLabel?: number | string;
  onClose?: () => void;
};

export const CommentsBottomSheet = ({ feedId, commentCountLabel, onClose }: CommentsBottomSheetProps) => {
  const { colors } = useTheme();

  const [comments, setComments] = useState<FeedCommentData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRepliesId, setLoadingRepliesId] = useState<string | null>(null); // Tracks which comment is loading replies

  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<FeedCommentData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputCommentRef = useRef<TextInput>(null);

  const handleFetchMoreReplies = async (parentComment: FeedCommentData) => {
    if (loadingRepliesId) return;
    setLoadingRepliesId(parentComment.id);

    // The current length of replies acts as our offset
    const currentOffset = parentComment.replies ? parentComment.replies.length : 0;

    try {
      const response = await feedService.getCommentReplies(feedId, parentComment.id, currentOffset, 10);

      setComments(prev => prev.map(c => {
        if (c.id === parentComment.id) {
          return {
            ...c,
            replies: [...(c.replies || []), ...response.results]
          };
        }
        return c;
      }));
    } catch (error) {
      console.error("Failed to load more replies", error);
    } finally {
      setLoadingRepliesId(null);
    }
  };


  // 2. Fetch Logic (Handles Pagination)
  const fetchComments = async (pageNum: number) => {
    try {
      const response = await feedService.getFeedComments(feedId, pageNum);
      if (pageNum === 1) {
        setComments(response.results);
      } else {
        setComments(prev => [...prev, ...response.results]);
      }
      setHasMore(!!response.next);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch comments");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Submit Logic
  const handleSend = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      // Pass text and parent ID (if it's a reply) to the parent screen
      const newCommentResponse = await feedService.addFeedComment(feedId, trimmed, replyingTo?.id)
      if (replyingTo) {
        // Logic for adding a reply to a parent comment
        setComments(prev => prev.map(c => {
          if (c.id === replyingTo.id) {
            return {
              ...c,
              replies: [...(c.replies || []), newCommentResponse]
            };
          }
          return c;
        }));
      } else {
        // Logic for adding a new top-level comment
        setComments(prev => [newCommentResponse, ...prev]);
      }

      // Reset input
      setCommentText('');
      setReplyingTo(null);
      Keyboard.dismiss();

      // Refresh the list to show the new comment immediately
      fetchComments(1);
    } catch (error) {
      console.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };


  // 4. Render Individual Comment & Its Replies
  const renderComment = ({ item }: { item: FeedCommentData }) => {
    // --- NEW: Calculate pagination states ---
    const loadedRepliesCount = item.replies ? item.replies.length : 0;
    // Uses the 'reply_count' from backend, or falls back to array length if missing
    const totalReplies = item.reply_count !== undefined ? item.reply_count : loadedRepliesCount;
    const hasMoreReplies = loadedRepliesCount < totalReplies;
    const remainingReplies = totalReplies - loadedRepliesCount;

    return (
      <View style={styles.commentContainer}>

        {/* Top Level Comment */}
        <View style={styles.commentRow}>
          <Image source={{ uri: item.user.profile_picture || 'https://via.placeholder.com/150' }} style={styles.avatar} />
          <View style={styles.commentContent}>
            <Text style={[styles.username, { color: colors.textSecondary }]}>
              {item.user.short_name} <Text style={styles.time}>{formatTime(item.created_at)}</Text>
            </Text>
            <Text style={[styles.commentText, { color: colors.text }]}>{item.text}</Text>
            <TouchableOpacity onPress={() => {
              setReplyingTo(item);
              console.log(inputCommentRef);
              inputCommentRef.current?.focus();
            }}>
              <Text style={[styles.replyText, { color: colors.textSecondary }]}>Reply</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.likeCol}>
            <AppIcon library="EvilIcons" name="heart" size={14} color={colors.textSecondary} />
            <Text style={[styles.likeCount, { color: colors.textSecondary }]}>0</Text>
          </View>
        </View>

        {/* Nested Replies Loop + Pagination Button */}
        {((item.replies && item.replies.length > 0) || hasMoreReplies) && (
          <View style={[styles.repliesContainer, { borderLeftColor: colors.border }]}>

            {/* 1. Map existing replies */}
            {item.replies?.map(reply => (
              <View key={reply.id} style={[styles.commentRow, styles.replyIndent]}>
                <Image source={{ uri: reply.user.profile_picture }} style={styles.avatar} />
                <View style={styles.commentContent}>
                  <Text style={[styles.username, { color: colors.textSecondary }]}>
                    {reply.user.short_name} <Text style={styles.time}>{formatTime(reply.created_at)}</Text>
                  </Text>
                  <Text style={[styles.commentText, { color: colors.text }]}>{reply.text}</Text>
                </View>
              </View>
            ))}

            {/* 2. NEW: "View More Replies" Button */}
            {hasMoreReplies && (
              <TouchableOpacity
                style={styles.viewMoreRepliesBtn}
                onPress={() => handleFetchMoreReplies(item)}
                disabled={loadingRepliesId === item.id}
              >
                {loadingRepliesId === item.id ? (
                  // Show loading spinner aligned to the left
                  <ActivityIndicator size="small" color={colors.textSecondary} style={{ alignSelf: 'flex-start', marginLeft: 20 }} />
                ) : (
                  <View style={styles.viewMoreRow}>
                    <View style={[styles.viewMoreLine, { backgroundColor: colors.border }]} />
                    <Text style={[styles.viewMoreText, { color: colors.textSecondary }]}>
                      View {remainingReplies} more {remainingReplies === 1 ? 'reply' : 'replies'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}

          </View>
        )}
      </View>
    );
  };

useEffect(() => {
  let isMounted = true;

  if (isMounted) {
    fetchComments(1);
  }

  return () => {
    isMounted = false;
  };
}, []);

  return (
    <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.sheet, { backgroundColor: colors.background }]}>

        {/* Header */}
        <View style={[styles.sheetHeader, { borderBottomColor: colors.divider }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Comments ({commentCountLabel || comments.length})
          </Text>
          <TouchableOpacity onPress={onClose}>
            <AppIcon library="Feather" name="x" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Paginated List */}
        <FlatList
          data={comments}
          keyExtractor={item => item.id}
          renderItem={renderComment}
          contentContainerStyle={styles.commentList}
          showsVerticalScrollIndicator={false}
          onEndReached={() => hasMore && !isLoading && fetchComments(page + 1)}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !isLoading ? (
              <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 40 }}>
                No comments yet. Be the first!
              </Text>
            ) : null
          }
          ListFooterComponent={
            isLoading ? <ActivityIndicator color={colors.primary} style={{ margin: 20 }} /> : null
          }
        />

        {/* Input Area */}
        <View style={[styles.inputRow, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
          {replyingTo ? (
            <View style={[styles.replyChip, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[styles.replyChipText, { color: colors.primary }]}>
                Replying to @{replyingTo.user.short_name}
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <AppIcon library="Feather" name="x" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={[styles.modernInputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              ref={inputCommentRef}
              style={[styles.modernInput, { color: colors.text }]}
              placeholder={replyingTo ? `Reply to @${replyingTo.user.short_name}...` : 'Add a comment...'}
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline // Allows the input to grow if text is long
            />

            <TouchableOpacity
              disabled={!commentText.trim() || isSubmitting}
              style={[styles.sendButton, { opacity: commentText.trim() ? 1 : 0.4 }]}
              onPress={handleSend}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <AppIcon library="Feather" name="send" size={18} color={colors.primary} />
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
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800' },

  commentList: { padding: 20, paddingBottom: 40 },
  commentContainer: { marginBottom: 20 },
  commentRow: { flexDirection: 'row' },

  repliesContainer: { marginLeft: 18, paddingLeft: 16, borderLeftWidth: 1, marginTop: 12 },
  replyIndent: { marginBottom: 12 },

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

  modernInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25, // Perfectly rounded pill shape
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    minHeight: 48,
    marginHorizontal: 4,
  },
  modernInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8, // Ensures text is vertically centered
    marginRight: 10,
  },
  sendButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  viewMoreRepliesBtn: {
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 4,
  },
  viewMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreLine: {
    height: 1,
    width: 24,
    marginRight: 8,
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
});