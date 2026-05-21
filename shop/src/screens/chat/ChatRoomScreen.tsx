import { Bubble, GiftedChat, IMessage, InputToolbar, Send } from '@tspvivek/react-native-gifted-chat';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Image,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const BUSINESS_OWNER = { _id: 1, name: 'Kushite Cutz' };
const CUSTOMER = { _id: 2, name: 'Amara Okoro', avatar: 'https://i.pravatar.cc/150?img=47' };

export const ChatRoomScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [attachmentSheetVisible, setAttachmentSheetVisible] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    const cameraRef = useRef<Camera>(null);
    const cameraDevice = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();

    const activeCustomer = route?.params?.thread
        ? {
            ...CUSTOMER,
            name: route.params.thread.name,
            avatar: route.params.thread.avatar,
        }
        : CUSTOMER;

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

    const startCamera = useCallback(async () => {
        setAttachmentSheetVisible(false);

        if (!hasPermission) {
            await requestPermission();
        }

        setCameraVisible(true);
    }, [hasPermission, requestPermission]);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    }, []);

    const sendSystemMessage = useCallback((text: string) => {
        onSend([
            {
                _id: Date.now(),
                text,
                createdAt: new Date(),
                user: BUSINESS_OWNER,
            },
        ]);
    }, [onSend]);

    const handleCapturePhoto = useCallback(async () => {
        if (!cameraRef.current || !hasPermission || !cameraDevice || isCapturing) return;

        try {
            setIsCapturing(true);
            const photo = await cameraRef.current.takePhoto({ enableShutterSound: false });

            onSend([
                {
                    _id: Date.now(),
                    text: '',
                    image: `file://${photo.path}`,
                    createdAt: new Date(),
                    user: BUSINESS_OWNER,
                },
            ]);

            setCameraVisible(false);
        } finally {
            setIsCapturing(false);
        }
    }, [cameraDevice, hasPermission, isCapturing, onSend]);

    const attachmentOptions = useMemo(() => ([
        { key: 'photo', label: 'Take Photo', icon: 'camera', iconColor: colors.primary, bg: colors.primary + '15', action: startCamera },
        {
            key: 'image',
            label: 'Send Image',
            icon: 'image',
            iconColor: colors.info,
            bg: colors.info + '18',
            action: () => {
                setAttachmentSheetVisible(false);
                onSend([
                    {
                        _id: Date.now(),
                        text: '',
                        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=900',
                        createdAt: new Date(),
                        user: BUSINESS_OWNER,
                    },
                ]);
            },
        },
        {
            key: 'file',
            label: 'Send File',
            icon: 'file',
            iconColor: colors.warning,
            bg: colors.warning + '18',
            action: () => {
                setAttachmentSheetVisible(false);
                sendSystemMessage('📎 AfroSpot_Brand_Assets.pdf');
            },
        },
        {
            key: 'voice',
            label: 'Record Voice Note',
            icon: 'mic',
            iconColor: colors.success,
            bg: colors.success + '18',
            action: () => {
                setAttachmentSheetVisible(false);
                sendSystemMessage('🎤 Voice note (00:12)');
            },
        },
        {
            key: 'contact',
            label: 'Share Contact',
            icon: 'user-plus',
            iconColor: colors.textSecondary,
            bg: colors.surface,
            action: () => {
                setAttachmentSheetVisible(false);
                sendSystemMessage('👤 Shared contact: AfroSpot Support');
            },
        },
    ]), [colors.info, colors.primary, colors.success, colors.surface, colors.textSecondary, colors.warning, onSend, sendSystemMessage, startCamera]);

    // Custom UI Overrides
    const renderBubble = (props: any) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: { backgroundColor: colors.primary, borderBottomRightRadius: 4, padding: 2 },
                left: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4, padding: 2 },
            }}
            textStyle={{
                right: { color: colors.textInverse },
                left: { color: colors.text },
            }}
        />
    );

    const renderInputToolbar = (props: any) => (
        <InputToolbar
            {...props}
            containerStyle={[
                styles.inputToolbar,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    shadowColor: colors.text,
                },
            ]}
            primaryStyle={styles.inputToolbarPrimary}
        />
    );

    const renderSend = (props: any) => (
        <Send {...props} containerStyle={styles.sendContainer}>
            <View style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
                <AppIcon library="Feather" name="send" size={16} color={colors.textInverse} />
            </View>
        </Send>
    );

    const renderActions = () => (
        <TouchableOpacity
            style={[styles.attachBtn, { backgroundColor: colors.primary + '14' }]}
            onPress={() => setAttachmentSheetVisible(true)}
        >
            <AppIcon library="Feather" name="plus" size={18} color={colors.primary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                        <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerProfile}>
                        <Image source={{ uri: activeCustomer.avatar }} style={styles.headerAvatar} />
                        <View>
                            <Text style={[styles.headerName, { color: colors.text }]}>{activeCustomer.name}</Text>
                            <Text style={[styles.headerStatus, { color: colors.success }]}>Online</Text>
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
                    renderActions={renderActions}
                    alwaysShowSend
                    bottomOffset={Platform.OS === 'ios' ? 8 : 4}
                    textInputStyle={[styles.composerInput, { color: colors.text }]}
                />
            </View>

            <Modal
                visible={attachmentSheetVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setAttachmentSheetVisible(false)}
            >
                <View style={[styles.sheetOverlay, { backgroundColor: colors.overlay }]}> 
                    <TouchableOpacity style={{ flex: 1, width: '100%' }} activeOpacity={1} onPress={() => setAttachmentSheetVisible(false)} />
                    <View style={[styles.sheetCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                        <View style={styles.sheetGrabberWrap}>
                            <View style={[styles.sheetGrabber, { backgroundColor: colors.border }]} />
                        </View>
                        <Text style={[styles.sheetTitle, { color: colors.text }]}>Share Something</Text>
                        {attachmentOptions.map((option) => (
                            <TouchableOpacity key={option.key} style={styles.optionRow} onPress={option.action}>
                                <View style={[styles.optionIcon, { backgroundColor: option.bg }]}> 
                                    <AppIcon library="Feather" name={option.icon as any} size={18} color={option.iconColor} />
                                </View>
                                <Text style={[styles.optionText, { color: colors.text }]}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            <Modal
                visible={cameraVisible}
                animationType="slide"
                onRequestClose={() => setCameraVisible(false)}
            >
                <View style={[styles.cameraScreen, { backgroundColor: colors.overlay }]}> 
                    {hasPermission && cameraDevice ? (
                        <Camera
                            ref={cameraRef}
                            style={styles.camera}
                            device={cameraDevice}
                            isActive={cameraVisible}
                            photo
                        />
                    ) : null}

                    <SafeAreaView style={styles.cameraOverlay}>
                        <View style={styles.cameraTopBar}>
                            <TouchableOpacity style={styles.cameraIconBtn} onPress={() => setCameraVisible(false)}>
                                <AppIcon library="Feather" name="x" size={24} color={colors.textInverse} />
                            </TouchableOpacity>
                            <Text style={[styles.cameraTitle, { color: colors.textInverse }]}>Take a Picture</Text>
                            <View style={{ width: 44 }} />
                        </View>

                        {!hasPermission ? (
                            <View style={styles.permissionWrap}>
                                <Text style={[styles.permissionText, { color: colors.textInverse }]}>Camera permission is required.</Text>
                                <TouchableOpacity style={[styles.permissionBtn, { backgroundColor: colors.primary }]} onPress={requestPermission}>
                                    <Text style={[styles.permissionBtnText, { color: colors.textInverse }]}>Allow Camera Access</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        <View style={styles.cameraBottomBar}>
                            <TouchableOpacity
                                style={[styles.shutterBtnOuter, { borderColor: colors.textInverse }]}
                                onPress={handleCapturePhoto}
                                disabled={isCapturing || !hasPermission || !cameraDevice}
                            >
                                <View style={[styles.shutterBtnInner, { backgroundColor: colors.textInverse }]} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
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
    inputToolbar: {
        borderWidth: 1,
        borderTopWidth: 1,
        marginHorizontal: 12,
        marginBottom: 12,
        borderRadius: 22,
        paddingVertical: 6,
        paddingHorizontal: 6,
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
    },
    inputToolbarPrimary: { alignItems: 'center' },
    composerInput: { fontSize: 15, lineHeight: 20, marginTop: 2, marginLeft: 2 },
    attachBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginLeft: 4, marginBottom: 2 },
    sendContainer: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
    sendBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },

    sheetOverlay: { flex: 1, justifyContent: 'flex-end' },
    sheetCard: { borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderBottomWidth: 0, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 26 },
    sheetGrabberWrap: { alignItems: 'center', paddingVertical: 10 },
    sheetGrabber: { width: 46, height: 4, borderRadius: 2 },
    sheetTitle: { fontSize: 17, fontWeight: '800', marginBottom: 6 },
    optionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
    optionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    optionText: { fontSize: 15, fontWeight: '600' },

    cameraScreen: { flex: 1 },
    camera: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
    cameraOverlay: { flex: 1, justifyContent: 'space-between' },
    cameraTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    cameraIconBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)' },
    cameraTitle: { fontSize: 16, fontWeight: '800' },
    permissionWrap: { alignItems: 'center', marginTop: 20, paddingHorizontal: 20 },
    permissionText: { fontSize: 14, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
    permissionBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
    permissionBtnText: { fontSize: 13, fontWeight: '700' },
    cameraBottomBar: { alignItems: 'center', paddingBottom: 34 },
    shutterBtnOuter: { width: 82, height: 82, borderRadius: 41, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.25)' },
    shutterBtnInner: { width: 62, height: 62, borderRadius: 31 },
});