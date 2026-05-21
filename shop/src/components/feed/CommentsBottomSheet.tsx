import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export type FeedComment = {
  id: string;
  user: string;
  text: string;
  time: string;
  likes: number;
  avatar: string;
  replyTo?: string;
};

const MOCK_COMMENTS: FeedComment[] = [
  { id: '1', user: 'jamal_99', text: 'Where is the shop located?', time: '2h', likes: 12, avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: '2', user: 'samantha_b', text: 'Cleanest fade I have seen in a minute 🔥', time: '5h', likes: 45, avatar: 'https://i.pravatar.cc/150?img=5' },
];

type CommentsBottomSheetProps = {
  comments?: FeedComment[];
  commentCountLabel?: string;
  onClose?: () => void;
};

export const CommentsBottomSheet = ({ comments = MOCK_COMMENTS, commentCountLabel, onClose }: CommentsBottomSheetProps) => {
  const { colors } = useTheme();
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState<FeedComment[]>(comments);
  const [replyingTo, setReplyingTo] = useState<FeedComment | null>(null);

  const handleReply = (selectedComment: FeedComment) => {
    setReplyingTo(selectedComment);
  };

  const clearReply = () => {
    setReplyingTo(null);
  };

  const handleSend = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;

    const newComment: FeedComment = {
      id: String(Date.now()),
      user: 'you',
      text: trimmed,
      time: 'now',
      likes: 0,
      avatar: 'https://i.pravatar.cc/150?img=12',
      replyTo: replyingTo?.user,
    };

    setCommentList((prev) => [newComment, ...prev]);
    setComment('');
    setReplyingTo(null);
  };

  return (
    <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.sheet, { backgroundColor: colors.background }]}>

        <View style={[styles.sheetHeader, { borderBottomColor: colors.divider }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Comments ({commentCountLabel || commentList.length})</Text>
          <TouchableOpacity onPress={onClose}><AppIcon library="Feather" name="x" size={24} color={colors.text} /></TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.commentList}>
          {commentList.map(c => (
            <View key={c.id} style={styles.commentRow}>
              <Image source={{ uri: c.avatar }} style={styles.avatar} />
              <View style={styles.commentContent}>
                <Text style={[styles.username, { color: colors.textSecondary }]}>{c.user} <Text style={styles.time}>{c.time}</Text></Text>
                {c.replyTo ? (
                  <Text style={[styles.replyingToText, { color: colors.primary }]}>Replying to @{c.replyTo}</Text>
                ) : null}
                <Text style={[styles.commentText, { color: colors.text }]}>{c.text}</Text>
                <TouchableOpacity onPress={() => handleReply(c)}>
                  <Text style={[styles.replyText, { color: colors.textSecondary }]}>Reply</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.likeCol}>
                <AppIcon library="EvilIcons" name="heart" size={14} color={colors.textSecondary} />
                <Text style={[styles.likeCount, { color: colors.textSecondary }]}>{c.likes}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.inputRow, { borderTopColor: colors.border, backgroundColor: colors.surface }]}> 
          {replyingTo ? (
            <View style={[styles.replyChip, { backgroundColor: colors.primary + '15' }]}> 
              <Text style={[styles.replyChipText, { color: colors.primary }]}>Replying to @{replyingTo.user}</Text>
              <TouchableOpacity onPress={clearReply}>
                <AppIcon library="Feather" name="x" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={styles.inputInnerRow}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder={replyingTo ? `Reply to @${replyingTo.user}...` : 'Add a comment...'}
              placeholderTextColor={colors.textSecondary}
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity disabled={!comment.trim()} style={{ opacity: comment.trim() ? 1 : 0.5 }} onPress={handleSend}>
              <AppIcon library="Feather" name="send" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: { height: '70%', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  commentList: { padding: 20, gap: 20 },
  commentRow: { flexDirection: 'row' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  commentContent: { flex: 1 },
  username: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  time: { fontWeight: '400', opacity: 0.7 },
  commentText: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  replyingToText: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  replyText: { fontSize: 12, fontWeight: '600' },
  likeCol: { alignItems: 'center', marginLeft: 12 },
  likeCount: { fontSize: 11, marginTop: 4 },
  inputRow: { paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1 },
  replyChip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginBottom: 8, gap: 6 },
  replyChipText: { fontSize: 11, fontWeight: '700' },
  time: { fontWeight: '400', opacity: 0.7 },
  inputInnerRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, height: 40, fontSize: 15 },
});