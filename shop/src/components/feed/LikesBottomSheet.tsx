import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { FeedLikeData } from '@type/feed';

type LikesBottomSheetProps = {
  users?: FeedLikeData[];
  likeCountLabel?: string | number;
  onClose?: () => void;
};

export const LikesBottomSheet = ({ users = [], likeCountLabel, onClose }: LikesBottomSheetProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.overlay, { backgroundColor: colors.overlay }]}> 
      <View style={[styles.sheet, { backgroundColor: colors.background }]}> 
        
        {/* Header */}
        <View style={[styles.sheetHeader, { borderBottomColor: colors.divider }]}> 
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Likes ({likeCountLabel !== undefined ? likeCountLabel : users.length})
          </Text>
          <TouchableOpacity onPress={onClose}>
            <AppIcon library="Feather" name="x" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* List Content */}
        <ScrollView contentContainerStyle={styles.listContent}>
          {users.map((user) => (
            <View key={user.id} style={[styles.userRow, { borderBottomColor: colors.border }]}> 
              <View style={styles.userInfo}>
                {/* 🚀 Fallback to placeholder if user has no avatar */}
                <Image 
                    source={{ uri: user.avatar || 'https://via.placeholder.com/150' }} 
                    style={styles.avatar} 
                />
                <View>
                  <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                  <Text style={[styles.userHandle, { color: colors.textSecondary }]}>@{user.username}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.viewBtn, { borderColor: colors.border }]}>
                <Text style={[styles.viewBtnText, { color: colors.text }]}>View</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* 🚀 Empty State Handling */}
          {users.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No likes yet.
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: { height: '65%', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  userRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  userName: { fontSize: 14, fontWeight: '700' },
  userHandle: { fontSize: 12, fontWeight: '500' },
  viewBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  viewBtnText: { fontSize: 12, fontWeight: '700' },

  // 🚀 New Empty State Style
  emptyText: { textAlign: 'center', marginTop: 30, fontSize: 14, fontWeight: '500' }
});