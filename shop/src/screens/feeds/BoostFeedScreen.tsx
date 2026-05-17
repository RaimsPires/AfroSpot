import React, { useState } from 'react';
import {
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@components/ui';
import { useTheme } from '@contexts/ThemeContext';

const BUDGET_OPTIONS = [
    { label: '$5', value: 5, reach: '1.2K–3.5K' },
    { label: '$10', value: 10, reach: '2.8K–7.0K' },
    { label: '$20', value: 20, reach: '5.5K–14K' },
    { label: '$50', value: 50, reach: '14K–35K' },
];

const DURATION_OPTIONS = [
    { label: '3 Days', value: 3 },
    { label: '7 Days', value: 7 },
    { label: '14 Days', value: 14 },
    { label: '30 Days', value: 30 },
];

const AUDIENCE_OPTIONS = [
    { label: 'Everyone', icon: 'globe', description: 'Reach a broad local audience' },
    { label: 'Followers', icon: 'users', description: 'Amplify to existing followers' },
    { label: 'Local Area', icon: 'map-pin', description: 'Target people near your store' },
];

export const BoostFeedScreen = ({ navigation, route }: any) => {
    const { colors, isDark } = useTheme();
    const feed = route?.params?.feed;

    const [selectedBudget, setSelectedBudget] = useState(BUDGET_OPTIONS[1]);
    const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[1]);
    const [selectedAudience, setSelectedAudience] = useState(AUDIENCE_OPTIONS[0].label);

    const estimatedReach = selectedBudget.reach;
    const totalSpend = selectedBudget.value * selectedDuration.value;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <AppIcon library="Feather" name="x" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Boost Feed</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Feed Preview */}
                {feed && (
                    <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <ImageBackground
                            source={{ uri: feed.thumbnail }}
                            style={styles.previewThumbnail}
                            imageStyle={{ borderRadius: 10 }}
                        >
                            <View style={styles.previewPlayBadge}>
                                <AppIcon library="Feather" name="play" size={16} color="#FFF" />
                            </View>
                        </ImageBackground>
                        <View style={styles.previewInfo}>
                            <Text style={[styles.previewCaption, { color: colors.text }]} numberOfLines={2}>
                                {feed.caption}
                            </Text>
                            <View style={styles.previewStats}>
                                <View style={styles.previewStatItem}>
                                    <AppIcon library="Feather" name="eye" size={12} color={colors.textSecondary} />
                                    <Text style={[styles.previewStatText, { color: colors.textSecondary }]}>{feed.views}</Text>
                                </View>
                                <View style={styles.previewStatItem}>
                                    <AppIcon library="AntDesign" name="heart" size={12} color={colors.textSecondary} />
                                    <Text style={[styles.previewStatText, { color: colors.textSecondary }]}>{feed.likes}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                {/* Estimated Reach Banner */}
                <View style={[styles.reachBanner, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}>
                    <AppIcon library="Feather" name="zap" size={20} color={colors.primary} />
                    <View style={styles.reachBannerInfo}>
                        <Text style={[styles.reachBannerValue, { color: colors.primary }]}>{estimatedReach} people</Text>
                        <Text style={[styles.reachBannerLabel, { color: colors.textSecondary }]}>Estimated reach per day</Text>
                    </View>
                    <Text style={[styles.reachBannerTotal, { color: colors.primary }]}>${totalSpend} total</Text>
                </View>

                {/* Daily Budget */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DAILY BUDGET</Text>
                    <View style={styles.optionsRow}>
                        {BUDGET_OPTIONS.map((opt) => {
                            const isActive = selectedBudget.value === opt.value;
                            return (
                                <TouchableOpacity
                                    key={opt.value}
                                    style={[
                                        styles.optionChip,
                                        {
                                            backgroundColor: isActive ? colors.primary : colors.surface,
                                            borderColor: isActive ? colors.primary : colors.border,
                                        },
                                    ]}
                                    onPress={() => setSelectedBudget(opt)}
                                >
                                    <Text style={[styles.optionChipValue, { color: isActive ? colors.textInverse : colors.text }]}>
                                        {opt.label}
                                    </Text>
                                    <Text style={[styles.optionChipSub, { color: isActive ? colors.textInverse + 'CC' : colors.textSecondary }]}>
                                        /day
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Duration */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DURATION</Text>
                    <View style={styles.optionsRow}>
                        {DURATION_OPTIONS.map((opt) => {
                            const isActive = selectedDuration.value === opt.value;
                            return (
                                <TouchableOpacity
                                    key={opt.value}
                                    style={[
                                        styles.optionChip,
                                        {
                                            backgroundColor: isActive ? colors.primary : colors.surface,
                                            borderColor: isActive ? colors.primary : colors.border,
                                        },
                                    ]}
                                    onPress={() => setSelectedDuration(opt)}
                                >
                                    <Text style={[styles.optionChipValue, { color: isActive ? colors.textInverse : colors.text }]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Audience */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>TARGET AUDIENCE</Text>
                    <View style={[styles.audienceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        {AUDIENCE_OPTIONS.map((opt, index) => {
                            const isActive = selectedAudience === opt.label;
                            const isLast = index === AUDIENCE_OPTIONS.length - 1;
                            return (
                                <TouchableOpacity
                                    key={opt.label}
                                    style={[
                                        styles.audienceRow,
                                        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
                                    ]}
                                    onPress={() => setSelectedAudience(opt.label)}
                                >
                                    <View style={[styles.audienceIconBg, { backgroundColor: isActive ? colors.primary + '15' : colors.background }]}>
                                        <AppIcon library="Feather" name={opt.icon as any} size={18} color={isActive ? colors.primary : colors.textSecondary} />
                                    </View>
                                    <View style={styles.audienceTextBlock}>
                                        <Text style={[styles.audienceLabel, { color: colors.text }]}>{opt.label}</Text>
                                        <Text style={[styles.audienceDesc, { color: colors.textSecondary }]}>{opt.description}</Text>
                                    </View>
                                    <View style={[
                                        styles.radioCircle,
                                        {
                                            borderColor: isActive ? colors.primary : colors.border,
                                            backgroundColor: isActive ? colors.primary : 'transparent',
                                        },
                                    ]}>
                                        {isActive && <AppIcon library="Feather" name="check" size={12} color={colors.textInverse} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Spend Summary */}
                <View style={[styles.summaryBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryKey, { color: colors.textSecondary }]}>Daily budget</Text>
                        <Text style={[styles.summaryVal, { color: colors.text }]}>${selectedBudget.value}/day</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryKey, { color: colors.textSecondary }]}>Duration</Text>
                        <Text style={[styles.summaryVal, { color: colors.text }]}>{selectedDuration.label}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryKey, { color: colors.textSecondary }]}>Audience</Text>
                        <Text style={[styles.summaryVal, { color: colors.text }]}>{selectedAudience}</Text>
                    </View>
                    <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryKey, { color: colors.text, fontWeight: '800' }]}>Total spend</Text>
                        <Text style={[styles.summaryVal, { color: colors.primary, fontWeight: '900', fontSize: 16 }]}>${totalSpend}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Launch Button */}
            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.launchBtn, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.goBack()}
                >
                    <AppIcon library="Feather" name="zap" size={20} color={colors.textInverse} />
                    <Text style={[styles.launchBtnText, { color: colors.textInverse }]}>Launch Boost · ${totalSpend}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    iconBtn: { padding: 8 },

    scrollContent: { padding: 20, paddingBottom: 110 },

    // Preview
    previewCard: { flexDirection: 'row', gap: 14, padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
    previewThumbnail: { width: 72, height: 96, borderRadius: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    previewPlayBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
    previewInfo: { flex: 1, justifyContent: 'center', gap: 10 },
    previewCaption: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
    previewStats: { flexDirection: 'row', gap: 14 },
    previewStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    previewStatText: { fontSize: 12, fontWeight: '600' },

    // Reach Banner
    reachBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 28 },
    reachBannerInfo: { flex: 1 },
    reachBannerValue: { fontSize: 16, fontWeight: '900' },
    reachBannerLabel: { fontSize: 12, fontWeight: '500' },
    reachBannerTotal: { fontSize: 16, fontWeight: '900' },

    // Sections
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 12 },
    optionsRow: { flexDirection: 'row', gap: 10 },
    optionChip: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
    optionChipValue: { fontSize: 15, fontWeight: '900' },
    optionChipSub: { fontSize: 10, fontWeight: '600' },

    // Audience
    audienceCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    audienceRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 14 },
    audienceIconBg: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    audienceTextBlock: { flex: 1 },
    audienceLabel: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
    audienceDesc: { fontSize: 12, fontWeight: '500' },
    radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },

    // Summary box
    summaryBox: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12, marginBottom: 8 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryKey: { fontSize: 13, fontWeight: '600' },
    summaryVal: { fontSize: 13, fontWeight: '700' },
    summaryDivider: { height: 1 },

    // Footer
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 34, borderTopWidth: 1 },
    launchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16, gap: 10 },
    launchBtnText: { fontSize: 16, fontWeight: '900' },
});
