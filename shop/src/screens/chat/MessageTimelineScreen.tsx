import React from 'react';
import {
    Image,
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

const CHAT_THREADS = [
    { id: '1', name: 'Amara Okoro', avatar: 'https://i.pravatar.cc/150?img=47', lastMessage: 'That works perfectly, thank you! Do you...', time: '10:15 AM', unread: 2 },
    { id: '2', name: 'Kwame Mensah', avatar: 'https://i.pravatar.cc/150?img=11', lastMessage: 'Can I reschedule my appointment for tomorrow?', time: 'Yesterday', unread: 0 },
    { id: '3', name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?img=5', lastMessage: 'I loved the silk scarf! I might buy another one.', time: 'Monday', unread: 0 },
];

export const MessageTimelineScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="edit" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchWrap}>
                <View style={[styles.searchBox, { backgroundColor: colors.surface }]}>
                    <AppIcon library="Feather" name="search" size={18} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Search conversations..."
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.searchInput, { color: colors.text }]}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {CHAT_THREADS.map((thread, index) => (
                    <TouchableOpacity
                        key={thread.id}
                        style={[styles.threadRow, index !== CHAT_THREADS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                        onPress={() => navigation.navigate('ChatRoomInTab', { thread })}
                    >
                        <Image source={{ uri: thread.avatar }} style={styles.avatar} />
                        <View style={styles.threadContent}>
                            <View style={styles.threadHeader}>
                                <Text style={[styles.threadName, { color: colors.text, fontWeight: thread.unread > 0 ? '900' : '700' }]}>{thread.name}</Text>
                                <Text style={[styles.threadTime, { color: thread.unread > 0 ? colors.primary : colors.textSecondary }]}>{thread.time}</Text>
                            </View>
                            <View style={styles.threadFooter}>
                                <Text
                                    style={[styles.lastMessage, { color: thread.unread > 0 ? colors.text : colors.textSecondary, fontWeight: thread.unread > 0 ? '700' : '400' }]}
                                    numberOfLines={1}
                                >
                                    {thread.lastMessage}
                                </Text>
                                {thread.unread > 0 && (
                                    <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                                        <Text style={[styles.unreadText, { color: colors.textInverse }]}>{thread.unread}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
    headerTitle: { fontSize: 24, fontWeight: '900' },
    iconBtn: { padding: 8 },
    searchWrap: { paddingHorizontal: 20, paddingBottom: 16 },
    searchBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 44, borderRadius: 22 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
    threadRow: { flexDirection: 'row', padding: 16, alignItems: 'center' },
    avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16 },
    threadContent: { flex: 1 },
    threadHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    threadName: { fontSize: 16 },
    threadTime: { fontSize: 12, fontWeight: '600' },
    threadFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lastMessage: { flex: 1, fontSize: 14, marginRight: 12 },
    unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
    unreadText: { fontSize: 11, fontWeight: '800' },
});