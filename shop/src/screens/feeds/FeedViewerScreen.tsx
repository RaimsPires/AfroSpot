import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video'; // 🚀 Replaced expo-av

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';
import { FeedData, feedService } from '@services/feedService';

const { width, height } = Dimensions.get('window');

export const FeedViewerScreen = ({ navigation }: any) => {
    const { colors } = useTheme();
    const [feeds, setFeeds] = useState<FeedData[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // --- Analytics Engine ---
    const viewLogsQueue = useRef<{ feed_id: string; duration: number }[]>([]);
    const currentVideoStartTime = useRef<number | null>(null);

    useEffect(() => {
        loadFeeds();
        return () => { flushAnalyticsQueue(); };
    }, []);

    const loadFeeds = async () => {
        try {
            const data = await feedService.getFeeds();
            setFeeds(data.results);
            if (data.results.length > 0) currentVideoStartTime.current = Date.now();
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const flushAnalyticsQueue = () => {
        recordCurrentVideoDuration();
        if (viewLogsQueue.current.length > 0) {
            feedService.logViewBatch(viewLogsQueue.current);
            viewLogsQueue.current = []; 
        }
    };

    const recordCurrentVideoDuration = () => {
        if (currentVideoStartTime.current !== null && feeds[activeIndex]) {
            const durationSeconds = (Date.now() - currentVideoStartTime.current) / 1000;
            viewLogsQueue.current.push({
                feed_id: feeds[activeIndex].id,
                duration: durationSeconds
            });
            currentVideoStartTime.current = null;
        }
    };

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const newIndex = viewableItems[0].index;
            if (newIndex !== activeIndex) {
                recordCurrentVideoDuration(); 
                setActiveIndex(newIndex);
                currentVideoStartTime.current = Date.now(); 
            }
        }
    }, [activeIndex, feeds]);

    if (isLoading) return <View style={[styles.container, { backgroundColor: '#000', justifyContent: 'center' }]}><ActivityIndicator color="#FFF" size="large" /></View>;

    return (
        <View style={[styles.container, { backgroundColor: '#000' }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <AppIcon library="Feather" name="chevron-left" size={28} color="#FFF" />
            </TouchableOpacity>

            <FlatList
                data={feeds}
                keyExtractor={(item) => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
                renderItem={({ item, index }) => (
                    <View style={{ width, height }}>
                        {/* 🚀 Updated Video Component */}
                        <Video
                            source={{ uri: item.video_file }}
                            style={StyleSheet.absoluteFill}
                            resizeMode="cover"
                            paused={activeIndex !== index} // Play only if it is the currently viewed item
                            repeat={true} // Loops the video
                            ignoreSilentSwitch="ignore" // Plays audio even if phone is on silent (optional)
                        />
                        <View style={styles.bottomGradient} />
                        
                        <View style={styles.rightActions}>
                            <View style={styles.actionItem}>
                                <AppIcon library="Feather" name="eye" size={28} color="#FFF" />
                                <Text style={styles.actionText}>{item.total_views}</Text>
                            </View>
                        </View>

                        <View style={styles.bottomInfo}>
                            <Text style={styles.businessText}>@{item.spot_name}</Text>
                            <Text style={styles.caption}>{item.caption}</Text>
                            <Text style={styles.tags}>{item.hashtags}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    backBtn: { position: 'absolute', top: 50, left: 16, zIndex: 100, padding: 8 },
    bottomGradient: { position: 'absolute', bottom: 0, width: '100%', height: '50%', backgroundColor: 'rgba(0,0,0,0.5)' },
    rightActions: { position: 'absolute', right: 16, bottom: 120, alignItems: 'center', gap: 24, zIndex: 10 },
    actionItem: { alignItems: 'center' },
    actionText: { color: '#FFF', fontSize: 13, fontWeight: '700', marginTop: 4 },
    bottomInfo: { position: 'absolute', bottom: 40, left: 20, width: '80%', zIndex: 10 },
    businessText: { color: '#FFF', fontSize: 16, fontWeight: '900', marginBottom: 8 },
    caption: { color: '#FFF', fontSize: 15, marginBottom: 8 },
    tags: { color: '#00D1FF', fontSize: 14, fontWeight: '700' },
});