import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MOCK_COMMENTS = [
  { id: '1', user: 'jamal_99', text: 'Where is the shop located?', time: '2h', likes: 12, avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: '2', user: 'samantha_b', text: 'Cleanest fade I have seen in a minute 🔥', time: '5h', likes: 45, avatar: 'https://i.pravatar.cc/150?img=5' },
];

export const CommentsBottomSheet = () => {
  const { colors } = useTheme();
  const [comment, setComment] = useState('');

  return (
    <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.sheet, { backgroundColor: colors.background }]}>

        <View style={[styles.sheetHeader, { borderBottomColor: colors.divider }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Comments (128)</Text>
          <TouchableOpacity><AppIcon library="Feather" name="x" size={24} color={colors.text} /></TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.commentList}>
          {MOCK_COMMENTS.map(c => (
            <View key={c.id} style={styles.commentRow}>
              <Image source={{ uri: c.avatar }} style={styles.avatar} />
              <View style={styles.commentContent}>
                <Text style={[styles.username, { color: colors.textSecondary }]}>{c.user} <Text style={styles.time}>{c.time}</Text></Text>
                <Text style={[styles.commentText, { color: colors.text }]}>{c.text}</Text>
                <TouchableOpacity><Text style={[styles.replyText, { color: colors.textSecondary }]}>Reply</Text></TouchableOpacity>
              </View>
              <View style={styles.likeCol}>
                <AppIcon library="EvilIcons" name="heart" size={14} color={colors.textSecondary} />
                <Text style={[styles.likeCount, { color: colors.textSecondary }]}>{c.likes}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.inputRow, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textSecondary}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity disabled={!comment} style={{ opacity: comment ? 1 : 0.5 }}>
            <AppIcon library="Feather" name="send" size={20} color={colors.primary} />
          </TouchableOpacity>
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
  replyText: { fontSize: 12, fontWeight: '600' },
  likeCol: { alignItems: 'center', marginLeft: 12 },
  likeCount: { fontSize: 11, marginTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1 },
  input: { flex: 1, height: 40, fontSize: 15 },
});