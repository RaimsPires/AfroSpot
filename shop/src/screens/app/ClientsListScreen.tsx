import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

// --- Mock Data ---
const MOCK_CLIENTS = [
    {
        id: '1',
        name: 'Amara Okoro',
        avatar: 'https://i.pravatar.cc/150?img=47',
        phone: '+1 (555) 123-4567',
        email: 'amara.o@example.com',
        lastVisit: 'Oct 24, 2023',
        totalVisits: 14,
        totalSpent: '$450.00',
        notes: 'Prefers morning appointments. Allergic to tea tree oil.',
    },
    {
        id: '2',
        name: 'Kwame Mensah',
        avatar: 'https://i.pravatar.cc/150?img=11',
        phone: '+1 (555) 987-6543',
        email: 'kwame.m@example.com',
        lastVisit: 'Oct 12, 2023',
        totalVisits: 3,
        totalSpent: '$105.00',
        notes: 'Usually books the Fresh Fade & Lineup.',
    },
    {
        id: '3',
        name: 'Sarah Jenkins',
        avatar: 'https://i.pravatar.cc/150?img=5',
        phone: '+1 (555) 234-5678',
        email: 's.jenkins@example.com',
        lastVisit: 'Sep 30, 2023',
        totalVisits: 8,
        totalSpent: '$680.00',
        notes: '',
    },
    {
        id: '4',
        name: 'David Osei',
        avatar: 'https://i.pravatar.cc/150?img=8',
        phone: '+1 (555) 345-6789',
        email: 'david.osei@example.com',
        lastVisit: 'Oct 25, 2023',
        totalVisits: 22,
        totalSpent: '$770.00',
        notes: 'VIP Client. Always offer complimentary beverage.',
    },
];

export const ClientsListScreen = ({ navigation }: any) => {
    const { colors, isDark } = useTheme();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState<typeof MOCK_CLIENTS[0] | null>(null);
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

    // Search Logic
    const filteredClients = MOCK_CLIENTS.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
    );

    // Handlers
    const handleOpenClient = (client: typeof MOCK_CLIENTS[0]) => {
        setSelectedClient(client);
        setBottomSheetVisible(true);
    };

    const handleCloseClient = () => {
        setBottomSheetVisible(false);
        setTimeout(() => setSelectedClient(null), 300); // Clear after animation
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* 1. Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    style={styles.iconBtn} onPress={() => { navigation.goBack() }}>
                    <AppIcon library="Feather" name="chevron-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Client Directory</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <AppIcon library="Feather" name="user-plus" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* 2. Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <AppIcon library="Feather" name="search" size={18} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Search by name or phone..."
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.searchInput, { color: colors.text }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <AppIcon library="Feather" name="x-circle" size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* 3. Client List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {filteredClients.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconBg, { backgroundColor: colors.surface }]}>
                            <AppIcon library="Feather" name="users" size={32} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Clients Found</Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                            Try adjusting your search query.
                        </Text>
                    </View>
                ) : (
                    filteredClients.map((client) => (
                        <TouchableOpacity
                            key={client.id}
                            style={[styles.clientCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => handleOpenClient(client)}
                        >
                            <Image source={{ uri: client.avatar }} style={styles.clientAvatar} />
                            <View style={styles.clientInfo}>
                                <Text style={[styles.clientName, { color: colors.text }]} numberOfLines={1}>{client.name}</Text>
                                <Text style={[styles.clientLastVisit, { color: colors.textSecondary }]}>Last visit: {client.lastVisit}</Text>
                            </View>
                            <View style={styles.clientMetrics}>
                                <Text style={[styles.metricSpent, { color: colors.primary }]}>{client.totalSpent}</Text>
                                <AppIcon library="Feather" name="chevron-right" size={18} color={colors.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* 4. Client Details Bottom Sheet */}
            <Modal
                visible={isBottomSheetVisible}
                transparent
                animationType="slide"
                onRequestClose={handleCloseClient}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalOverlay}
                >
                    {/* Dimmed Background to close */}
                    <TouchableWithoutFeedback onPress={handleCloseClient}>
                        <View style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]} />
                    </TouchableWithoutFeedback>

                    {/* Bottom Sheet Content */}
                    <View style={[styles.bottomSheet, { backgroundColor: colors.background, borderTopColor: colors.border }]}>

                        {/* Handle/Grabber */}
                        <View style={styles.sheetGrabberWrap}>
                            <View style={[styles.sheetGrabber, { backgroundColor: colors.border }]} />
                        </View>

                        {selectedClient && (
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetScroll}>

                                {/* Profile Header */}
                                <View style={styles.sheetHeader}>
                                    <Image source={{ uri: selectedClient.avatar }} style={styles.sheetAvatar} />
                                    <Text style={[styles.sheetName, { color: colors.text }]}>{selectedClient.name}</Text>
                                    <Text style={[styles.sheetSub, { color: colors.textSecondary }]}>Client since 2022</Text>
                                </View>

                                {/* Quick Actions Row */}
                                <View style={styles.actionsRow}>
                                    <TouchableOpacity
                                    onPress={()=>{
                                        Linking.openURL(`tel:${selectedClient.phone}`);
                                    }}
                                    style={[styles.actionCircle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <AppIcon library="Feather" name="phone" size={20} color={colors.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            handleCloseClient();
                                            navigation.navigate('MainTabs', {
                                                screen: 'MessagesTab',
                                                params: {
                                                    screen: 'ChatRoomInTab',
                                                    params: {
                                                        thread: {
                                                            id: `client-${selectedClient.id}`,
                                                            name: selectedClient.name,
                                                            avatar: selectedClient.avatar,
                                                        },
                                                    },
                                                },
                                            });
                                            }}
                                        style={[styles.actionCircle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <AppIcon library="Feather" name="message-circle" size={20} color={colors.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Linking.openURL(`mailto:${selectedClient.email}`);
                                        }}
                                        style={[styles.actionCircle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <AppIcon library="Feather" name="mail" size={20} color={colors.primary} />
                                    </TouchableOpacity>
                                </View>

                                {/* Lifetime Stats */}
                                <View style={styles.statsContainer}>
                                    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <Text style={[styles.statValue, { color: colors.text }]}>{selectedClient.totalVisits}</Text>
                                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Visits</Text>
                                    </View>
                                    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                        <Text style={[styles.statValue, { color: colors.text }]}>{selectedClient.totalSpent}</Text>
                                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Spent</Text>
                                    </View>
                                </View>

                                {/* Contact Info List */}
                                <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <View style={[styles.infoRow, styles.infoRowDivider, { borderBottomColor: colors.border }]}>
                                        <AppIcon library="Feather" name="phone" size={16} color={colors.textSecondary} />
                                        <Text style={[styles.infoText, { color: colors.text }]}>{selectedClient.phone}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <AppIcon library="Feather" name="mail" size={16} color={colors.textSecondary} />
                                        <Text style={[styles.infoText, { color: colors.text }]}>{selectedClient.email}</Text>
                                    </View>
                                </View>

                                {/* Notes Section */}
                                {selectedClient.notes ? (
                                    <View style={styles.notesContainer}>
                                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Client Notes</Text>
                                        <View style={[styles.notesBox, { backgroundColor: colors.warningSurface, borderColor: colors.warning }]}>
                                            <Text style={[styles.notesText, { color: colors.warning }]}>{selectedClient.notes}</Text>
                                        </View>
                                    </View>
                                ) : null}

                                {/* Book Appointment Button */}
                                <TouchableOpacity style={[styles.bookBtn, { backgroundColor: colors.primary }]}>
                                    <Text style={[styles.bookBtnText, { color: colors.textInverse }]}>Book Appointment</Text>
                                </TouchableOpacity>

                            </ScrollView>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </Modal>

        </SafeAreaView>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    // Search
    searchContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    searchBox: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },

    // List
    listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
    clientCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
    clientAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
    clientInfo: { flex: 1, justifyContent: 'center' },
    clientName: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
    clientLastVisit: { fontSize: 12 },
    clientMetrics: { alignItems: 'flex-end', flexDirection: 'row', gap: 8 },
    metricSpent: { fontSize: 15, fontWeight: '900' },

    // Empty State
    emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
    emptyIconBg: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center' },

    // --- Modal / Bottom Sheet Styles ---
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalBackdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
    bottomSheet: { borderTopLeftRadius: 30, borderTopRightRadius: 30, maxHeight: '85%', borderWidth: 1, borderBottomWidth: 0 },

    sheetGrabberWrap: { width: '100%', alignItems: 'center', paddingTop: 12, paddingBottom: 20 },
    sheetGrabber: { width: 40, height: 5, borderRadius: 3 },

    sheetScroll: { paddingHorizontal: 24, paddingBottom: 40 },

    sheetHeader: { alignItems: 'center', marginBottom: 24 },
    sheetAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
    sheetName: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
    sheetSub: { fontSize: 13, fontWeight: '600' },

    actionsRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 },
    actionCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

    statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statBox: { flex: 1, paddingVertical: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
    statValue: { fontSize: 20, fontWeight: '900', marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: '600' },

    infoCard: { borderRadius: 16, borderWidth: 1, marginBottom: 24 },
    infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
    infoRowDivider: { borderBottomWidth: 1 },
    infoText: { fontSize: 15, fontWeight: '500' },

    notesContainer: { marginBottom: 32 },
    sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
    notesBox: { padding: 16, borderRadius: 12, borderWidth: 1 },
    notesText: { fontSize: 14, lineHeight: 22, fontWeight: '500' },

    bookBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    bookBtnText: { fontSize: 16, fontWeight: '800' },
});