import { Bubble, GiftedChat, IMessage, InputToolbar, Send } from '@tspvivek/react-native-gifted-chat';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const BUSINESS_OWNER = { _id: 1, name: 'Kushite Cutz' }; // Logged in user
const CUSTOMER = { _id: 2, name: 'Amara Okoro', avatar: 'https://i.pravatar.cc/150?img=47' };

export const ChatRoomScreen = () => {
    const { colors, isDark } = useTheme();
    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        setMessages([
            {
                _id: 2,
                text: 'That works perfectly, thank you! Do you have that organic beard oil in stock?',
                createdAt: new Date(Date.now() - 1000 * 60 * 5),
                user: CUSTOMER,
            },
            {
                _id: 1,
                text: 'Hello Amara! Yes, we do! I just sent you an open slot. Let me know if this works for you.',
                createdAt: new Date(Date.now() - 1000 * 60 * 15),
                user: BUSINESS_OWNER,
            },
        ]);
    }, []);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    }, []);

    // Custom UI Overrides
    const renderBubble = (props: any) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: { backgroundColor: colors.primary, borderBottomRightRadius: 4, padding: 2 },
                left: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4, padding: 2 },
            }}
            textStyle={{
                right: { color: '#FFF' },
                left: { color: colors.text },
            }}
        />
    );

    const renderInputToolbar = (props: any) => (
        <InputToolbar
            {...props}
            containerStyle={[styles.inputToolbar, { backgroundColor: colors.background, borderTopColor: colors.border }]}
            primaryStyle={{ alignItems: 'center' }}
        />
    );

    const renderSend = (props: any) => (
        <Send {...props} containerStyle={styles.sendContainer}>
            <View style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
                <AppIcon library="Feather" name="send" size={16} color="#FFF" />
            </View>
        </Send>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerProfile}>
                        <Image source={{ uri: CUSTOMER.avatar }} style={styles.headerAvatar} />
                        <View>
                            <Text style={[styles.headerName, { color: colors.text }]}>{CUSTOMER.name}</Text>
                            <Text style={[styles.headerStatus, { color: '#10B981' }]}>Online</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="phone" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <AppIcon library="Feather" name="more-vertical" size={20} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Chat Area */}
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={BUSINESS_OWNER}
                    renderBubble={renderBubble}
                    renderInputToolbar={renderInputToolbar}
                    renderSend={renderSend}
                    alwaysShowSend
                    bottomOffset={Platform.OS === 'ios' ? 34 : 0} // SafeArea buffer for iOS devices
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, zIndex: 10 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconBtn: { padding: 8 },
    headerProfile: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerAvatar: { width: 40, height: 40, borderRadius: 20 },
    headerName: { fontSize: 16, fontWeight: '800' },
    headerStatus: { fontSize: 12, fontWeight: '600' },
    headerRight: { flexDirection: 'row', gap: 4 },

    // Input UI Customizations
    inputToolbar: { borderTopWidth: 1, paddingTop: 4, paddingBottom: 4 },
    sendContainer: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
    sendBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});