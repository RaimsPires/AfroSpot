import { Actions, Bubble, GiftedChat, IMessage, InputToolbar, Send } from 'react-native-gifted-chat';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { AppIcon } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import type { AppStackNavigationProp } from '@/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Mock Users ---
const MY_USER = { _id: 1, name: 'Amara' };
const BUSINESS_USER = {
    _id: 2,
    name: 'Kushite Cutz & Styles',
    avatar: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200'
};

const ChatScreen = () => {
    const navigation = useNavigation<AppStackNavigationProp<'Chat'>>();
    const { colors, isDark } = useTheme();
    const [messages, setMessages] = useState<IMessage[]>([]);

    const renderActionIcon = useCallback(
        () => <AppIcon library="Feather" name="plus" size={24} color={colors.textSecondary} />,
        [colors.textSecondary]
    );

    useEffect(() => {
        // Load Initial Mock Messages formatted for Gifted Chat
        setMessages([
            {
                _id: 7,
                text: '',
                createdAt: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
                user: BUSINESS_USER,
                // Custom Payload
                product: {
                    title: 'Kushite Organic Beard Oil',
                    brand: 'KUSHITE APOTHECARY',
                    price: '$18.50',
                    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=200',
                }
            } as any, // Type assertion for custom payload
            {
                _id: 6,
                text: 'Absolutely. Here is the product you mentioned. We can have it ready for you to pick up after your appointment.',
                createdAt: new Date(Date.now() - 1000 * 60 * 3),
                user: BUSINESS_USER,
            },
            {
                _id: 5,
                text: 'That works perfectly, thank you! Also, do you have that organic beard oil in stock?',
                createdAt: new Date(Date.now() - 1000 * 60 * 5),
                user: MY_USER,
            },
            {
                _id: 4,
                text: '',
                createdAt: new Date(Date.now() - 1000 * 60 * 8),
                user: BUSINESS_USER,
                // Custom Payload
                appointment: {
                    title: 'Fresh Fade & Lineup',
                    date: 'Fri, Oct 26',
                    time: '04:00 PM',
                    professional: 'Kwame O.',
                    price: '$35.00',
                }
            } as any,
            {
                _id: 3,
                text: 'Yes, we do! I just sent you an open slot. Let me know if this works for you.',
                createdAt: new Date(Date.now() - 1000 * 60 * 9),
                user: BUSINESS_USER,
            },
            {
                _id: 2,
                text: 'Hi! I wanted to check if you have any availability for a Fresh Fade this Friday?',
                createdAt: new Date(Date.now() - 1000 * 60 * 15),
                user: MY_USER,
            },
            {
                _id: 1,
                text: 'Hello Amara! Thanks for reaching out. How can we help you today?',
                createdAt: new Date(Date.now() - 1000 * 60 * 20),
                user: BUSINESS_USER,
            },
        ]);
    }, []);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    }, []);

    // --- Custom Renderers for Gifted Chat ---

    const renderBubble = (props: any) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: colors.primary,
                        borderBottomRightRadius: 4,
                        padding: 2,
                    },
                    left: {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                        borderBottomLeftRadius: 4,
                        padding: 2,
                    },
                }}
                textStyle={{
                    right: { color: '#FFF' },
                    left: { color: colors.text },
                }}
            />
        );
    };

    // Renders the rich Appointment and Product cards inside the chat bubble
    const renderCustomView = (props: any) => {
        const { currentMessage } = props;

        if (currentMessage.appointment) {
            const appt = currentMessage.appointment;
            return (
                <View style={styles.richCard}>
                    <View style={styles.richHeader}>
                        <AppIcon library="Feather" name="calendar" size={14} color={colors.primary} />
                        <Text style={[styles.richHeaderTitle, { color: colors.primary }]}>APPOINTMENT OFFER</Text>
                    </View>
                    <Text style={[styles.richTitle, { color: colors.text }]}>{appt.title}</Text>
                    <Text style={[styles.richSub, { color: colors.textSecondary }]}>{appt.date} at {appt.time}</Text>
                    <Text style={[styles.richSub, { color: colors.textSecondary }]}>With {appt.professional}</Text>
                    <TouchableOpacity style={[styles.richBtn, { backgroundColor: colors.primary }]}>
                        <Text style={styles.richBtnText}>Confirm for {appt.price}</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (currentMessage.product) {
            const prod = currentMessage.product;
            return (
                <View style={styles.richCard}>
                    <View style={styles.richProductRow}>
                        <Image source={{ uri: prod.image }} style={styles.richProductImg} />
                        <View style={styles.richProductInfo}>
                            <Text style={[styles.richProductBrand, { color: colors.textSecondary }]}>{prod.brand}</Text>
                            <Text style={[styles.richProductTitle, { color: colors.text }]} numberOfLines={2}>{prod.title}</Text>
                            <Text style={[styles.richProductPrice, { color: colors.primary }]}>{prod.price}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.richBtnOutline, { borderColor: colors.primary }]}>
                        <Text style={[styles.richBtnOutlineText, { color: colors.primary }]}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    const renderInputToolbar = (props: any) => (
        <InputToolbar
            {...props}
            containerStyle={[styles.inputToolbar, { backgroundColor: colors.background, borderTopColor: colors.border }]}
            primaryStyle={styles.inputPrimary}
        />
    );

    const renderActions = (props: any) => (
        <Actions
            {...props}
            containerStyle={styles.actionsContainer}
            icon={renderActionIcon}
            onPressActionButton={() => { /* Handle attachments */ }}
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
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Custom WhatsApp-Style Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerProfile}>
                        <Image source={{ uri: BUSINESS_USER.avatar }} style={styles.headerAvatar} />
                        <View>
                            <Text style={[styles.headerName, { color: colors.text }]}>{BUSINESS_USER.name}</Text>
                            <Text style={[styles.headerStatus, { color: colors.primary }]}>Online</Text>
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

            <View style={styles.chatBody}>
                <GiftedChat
                    messages={messages}
                    onSend={newMessages => onSend(newMessages as IMessage[])}
                    user={MY_USER}
                    renderBubble={renderBubble}
                    renderCustomView={renderCustomView}
                    renderInputToolbar={renderInputToolbar}
                    renderActions={renderActions}
                    renderSend={renderSend}
                />
            </View>
        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },
    chatBody: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconBtn: { padding: 8 },
    headerProfile: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerAvatar: { width: 40, height: 40, borderRadius: 20 },
    headerName: { fontSize: 15, fontWeight: '800' },
    headerStatus: { fontSize: 12, fontWeight: '600' },
    headerRight: { flexDirection: 'row', gap: 4 },

    // Rich Content Cards (Inside Bubbles)
    richCard: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, width: 250, margin: 4 },
    richHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    richHeaderTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
    richTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
    richSub: { fontSize: 13, marginBottom: 2 },
    richBtn: { marginTop: 12, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    richBtnText: { color: '#FFF', fontSize: 13, fontWeight: '800' },

    richProductRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    richProductImg: { width: 60, height: 60, borderRadius: 8 },
    richProductInfo: { flex: 1, justifyContent: 'center' },
    richProductBrand: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
    richProductTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
    richProductPrice: { fontSize: 14, fontWeight: '900' },
    richBtnOutline: { paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
    richBtnOutlineText: { fontSize: 13, fontWeight: '800' },

    // Input Toolbar Customization
    inputToolbar: { borderTopWidth: 1, paddingTop: 4, paddingBottom: 4 },
    inputPrimary: { alignItems: 'center' },
    actionsContainer: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: 4, marginBottom: 0 },
    sendContainer: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
    sendBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});

export default ChatScreen;