import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const SUPPORT_CHANNELS = [
    { id: '1', icon: 'message-square', title: 'Live Chat', subtitle: 'Average reply time: 2 mins' },
    { id: '2', icon: 'mail', title: 'Email Support', subtitle: 'support@afrospot.com' },
    { id: '3', icon: 'phone', title: 'Call Support', subtitle: '+1 (800) 234-8892' },
];

export const ContactSupportScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}> 
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="chevron-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Contact Support</Text>
                <View style={styles.iconBtn} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {SUPPORT_CHANNELS.map((channel) => (
                    <TouchableOpacity
                        key={channel.id}
                        style={[styles.channelCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => {
                            if (channel.id === '1') {
                                navigation.navigate('MainTabs', {
                                    screen: 'MessagesTab',
                                    params: {
                                        screen: 'ChatRoomInTab',
                                        params: {
                                            thread: {
                                                id: 'support-1',
                                                name: 'AfroSpot Support',
                                                avatar: 'https://i.pravatar.cc/150?img=15',
                                            },
                                        },
                                    },
                                });
                            }
                        }}
                    >
                        <View style={[styles.iconBg, { backgroundColor: colors.primary + '15' }]}>
                            <AppIcon library="Feather" name={channel.icon as any} size={16} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.channelTitle, { color: colors.text }]}>{channel.title}</Text>
                            <Text style={[styles.channelSubtitle, { color: colors.textSecondary }]}>{channel.subtitle}</Text>
                        </View>
                        <AppIcon library="Feather" name="chevron-right" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    iconBtn: { width: 32, alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '800' },
    content: { padding: 20, gap: 12 },
    channelCard: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBg: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    channelTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
    channelSubtitle: { fontSize: 12, fontWeight: '500' },
});
