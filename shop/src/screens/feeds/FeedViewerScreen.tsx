import React from 'react';
import {
    Dimensions,
    ImageBackground,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { CommentsBottomSheet } from '@components/feed/CommentsBottomSheet';
import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
// Simulate viewing the first feed item
const FEED_ITEM = {
    id: '1',
    videoCover: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800',
    views: '12.4K',
    likes: '1.2K',
    comments: '84',
    caption: 'Fresh fades all day! Drop by Kushite Cutz. 🔥',
    tags: '#FreshCut #BarberShop #Harlem',
};


export const FeedViewerScreen = () => {
    const { colors } = useTheme();
    const [commentsVisible, setCommentsVisible] = React.useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.overlay }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ImageBackground source={{ uri: FEED_ITEM.videoCover }} style={styles.videoBackground}>
                {/* Dark Gradient Overlay at the bottom */}
                <View style={styles.bottomGradient} />

                {/* Top Header (Absolute) */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => {/* navigation.goBack() */ }}>
                        <AppIcon library="Feather" name="chevron-left" size={28} color={colors.textInverse} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.textInverse }]}>Feed Insights</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Right Actions */}
                <View style={styles.rightActions}>
                    <View style={styles.actionItem}>
                        <View style={styles.iconCircle}>
                            <AppIcon library="Feather" name="eye" size={24} color={colors.textInverse} />
                        </View>
                        <Text style={[styles.actionText, { color: colors.textInverse }]}>{FEED_ITEM.views}</Text>
                    </View>

                    <View style={styles.actionItem}>
                        <View style={styles.iconCircle}>
                            <AppIcon library="AntDesign" name="heart" size={24} color={colors.textInverse} />
                        </View>
                        <Text style={[styles.actionText, { color: colors.textInverse }]}>{FEED_ITEM.likes}</Text>
                    </View>

                    <View style={styles.actionItem}>
                        <View style={styles.iconCircle}>
                            <AppIcon library="Feather" name="message-circle" size={24} color={colors.textInverse} />
                        </View>
                        <Text style={[styles.actionText, { color: colors.textInverse }]}>{FEED_ITEM.comments}</Text>
                    </View>

                    <TouchableOpacity style={styles.actionItem}>
                        <View style={[styles.iconCircle, { backgroundColor: colors.destructive + 'CC' }]}>
                            <AppIcon library="Feather" name="trash-2" size={20} color={colors.textInverse} />
                        </View>
                        <Text style={[styles.actionText, { color: colors.textInverse }]}>Delete</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Info */}
                <Modal
                visible={commentsVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setCommentsVisible(false)}
            >
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={() => setCommentsVisible(false)}
                />
                <CommentsBottomSheet />
            </Modal>
            </ImageBackground>
        </View>
    );
};  

const styles = StyleSheet.create({
    container: { flex: 1 },
    videoBackground: { width: width, height: height, justifyContent: 'flex-end' },
    bottomGradient: { position: 'absolute', bottom: 0, width: '100%', height: '50%', backgroundColor: 'rgba(0,0,0,0.6)' },

    header: { position: 'absolute', top: 50, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 10 },
    iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },

    rightActions: { position: 'absolute', right: 16, bottom: 120, alignItems: 'center', gap: 24, zIndex: 10 },
    actionItem: { alignItems: 'center' },
    iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    actionText: { fontSize: 12, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },

    bottomInfo: { paddingHorizontal: 20, paddingBottom: 40, width: '80%', zIndex: 10 },
    businessBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 6, marginBottom: 12 },
    businessText: { fontSize: 12, fontWeight: '800' },
    caption: { fontSize: 15, lineHeight: 22, fontWeight: '500', marginBottom: 8 },
    tags: { fontSize: 14, fontWeight: '700', marginBottom: 16 },

    linkedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    linkedIconBg: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    linkedTitle: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
    linkedSub: { fontSize: 12, fontWeight: '600' },
});
