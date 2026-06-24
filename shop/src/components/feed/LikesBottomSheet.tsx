import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { feedService } from '@services/feedService'; // Ensure this path is correct
import { FeedLikeData } from '@type/feed';

type LikesBottomSheetProps = {
  feedId: string; // 🚀 Pass the feedId to fetch data internally
  likeCountLabel?: string | number;
  onClose?: () => void;
};

export const LikesBottomSheet = ({ feedId, likeCountLabel, onClose }: LikesBottomSheetProps) => {
  const { colors } = useTheme();

  // Pagination States
  const [likes, setLikes] = useState<FeedLikeData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLikes(1);
  }, [feedId]);

  const fetchLikes = async (pageNum: number) => {
    try {
      // 🚀 Assuming you have this method in your feedService
      const response = await feedService.getFeedLikes(feedId, pageNum);
      
      if (pageNum === 1) {
        setLikes(response.results);
      } else {
        setLikes(prev => [...prev, ...response.results]);
      }
      
      setHasMore(!!response.next);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch likes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLike = ({ item: user }: { item: FeedLikeData }) => (
    <View style={[styles.userRow, { borderBottomColor: colors.border }]}> 
      <View style={styles.userInfo}>
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
  );

  return (
    <View style={[styles.overlay, { backgroundColor: colors.overlay }]}> 
      <View style={[styles.sheet, { backgroundColor: colors.background }]}> 
        
        {/* Header */}
        <View style={[styles.sheetHeader, { borderBottomColor: colors.divider }]}> 
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Likes ({likeCountLabel !== undefined ? likeCountLabel : likes.length})
          </Text>
          <TouchableOpacity onPress={onClose}>
            <AppIcon library="Feather" name="x" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Paginated List Content */}
        <FlatList
          data={likes}
          keyExtractor={(item) => item.id}
          renderItem={renderLike}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={() => hasMore && !isLoading && fetchLikes(page + 1)}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !isLoading ? (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No likes yet. Be the first!
              </Text>
            ) : null
          }
          ListFooterComponent={
            isLoading ? <ActivityIndicator color={colors.primary} style={{ margin: 20 }} /> : null
          }
        />
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

  emptyText: { textAlign: 'center', marginTop: 30, fontSize: 14, fontWeight: '500' }
});