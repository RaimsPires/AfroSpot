import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingVertical: 16 },
    headerTitle: { fontSize: 24, fontWeight: '900' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },

    profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, marginTop: 8 },
    businessAvatar: { width: 72, height: 72, borderRadius: 16, marginRight: 16 },
    businessInfo: { flex: 1 },
    businessName: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
    businessEmail: { fontSize: 13, marginBottom: 8 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    ratingText: { fontSize: 13, fontWeight: '600' },
    viewProfileBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, marginLeft: 16, marginBottom: 8 },
    card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },

    itemContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 },
    itemLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBg: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    itemLabel: { fontSize: 15, fontWeight: '600' },
    itemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    itemValue: { fontSize: 13, fontWeight: '600' },

    signOutButton: {
        marginTop: 8,
        borderWidth: 1,
        borderRadius: 14,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signOutText: { fontSize: 15, fontWeight: '800' },

    appVersion: { textAlign: 'center', marginTop: 16, marginBottom: 32, fontSize: 12, fontWeight: '500' },
});
