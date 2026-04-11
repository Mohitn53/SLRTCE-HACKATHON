/**
 * Knowledge Hub Screen — AI-summarized community insights
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MainBackground } from '../../../components/MainBackground';
import { GlassCard } from '../../../components/GlassCard';
import { colors, spacing } from '../../../core/theme';
import communityService from '../services/communityService';

const TAG_COLORS = { Irrigation: '#0288D1', Disease: '#E53935', Soil: '#795548', Crops: '#2E7D32' };

const KnowledgeHubScreen = () => {
    const navigation = useNavigation();
    const [tips, setTips] = useState([]);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => { communityService.getKnowledgeHub().then(setTips); }, []);

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <GlassCard style={styles.backBtn} intensity={25} noPadding>
                            <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
                        </GlassCard>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Knowledge Hub</Text>
                    <View style={{ width: 42 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Hero */}
                    <GlassCard style={styles.heroBanner} intensity={35}>
                        <View style={styles.heroRow}>
                            <View style={styles.heroIcon}>
                                <MaterialCommunityIcons name="brain" size={32} color="#7C4DFF" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.heroTitle}>AI-Curated Insights</Text>
                                <Text style={styles.heroDesc}>
                                    Kisaan AI reads thousands of community discussions every week and distills the most important agricultural knowledge into actionable tips for you.
                                </Text>
                            </View>
                        </View>
                    </GlassCard>

                    <Text style={styles.sectionTitle}>This Week's Top Insights</Text>

                    {tips.map(tip => {
                        const tagColor = TAG_COLORS[tip.tag] || colors.primary;
                        const isOpen = expanded === tip.id;
                        return (
                            <GlassCard key={tip.id} style={styles.tipCard} intensity={25}>
                                <View style={[styles.tipTagRow]}>
                                    <View style={[styles.tipTag, { backgroundColor: tagColor }]}>
                                        <Text style={styles.tipTagText}>{tip.tag}</Text>
                                    </View>
                                    <Text style={styles.tipMeta}>Saved by {tip.savedBy} farmers · {tip.updated}</Text>
                                </View>
                                <Text style={styles.tipTitle}>{tip.title}</Text>
                                {isOpen && (
                                    <Text style={styles.tipSummary}>{tip.summary}</Text>
                                )}
                                <TouchableOpacity
                                    style={styles.expandBtn}
                                    onPress={() => setExpanded(isOpen ? null : tip.id)}
                                >
                                    <Text style={styles.expandBtnText}>{isOpen ? 'Show Less' : 'Read Insight'}</Text>
                                    <MaterialCommunityIcons
                                        name={isOpen ? "chevron-up" : "chevron-down"}
                                        size={16}
                                        color={colors.primary}
                                    />
                                </TouchableOpacity>
                            </GlassCard>
                        );
                    })}

                    {/* Stats */}
                    <Text style={styles.sectionTitle}>Community This Month</Text>
                    <View style={styles.statsGrid}>
                        {[
                            { label: 'Discussions', value: '2,840', icon: 'forum', color: '#2E7D32' },
                            { label: 'Solutions', value: '1,120', icon: 'check-circle', color: '#0288D1' },
                            { label: 'Active Farmers', value: '5,400+', icon: 'account-group', color: '#E53935' },
                            { label: 'AI Answers', value: '640', icon: 'robot-happy', color: '#7C4DFF' },
                        ].map(stat => (
                            <GlassCard key={stat.label} style={styles.statCard} intensity={20} noPadding>
                                <View style={styles.statCardInner}>
                                    <MaterialCommunityIcons name={stat.icon} size={24} color={stat.color} />
                                    <Text style={styles.statValue}>{stat.value}</Text>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                            </GlassCard>
                        ))}
                    </View>

                    <View style={{ height: 80 }} />
                </ScrollView>
            </SafeAreaView>
        </MainBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    headerTitle: { fontSize: 20, fontWeight: '900', color: colors.text.primary },
    backBtn: { width: 42, height: 42, borderRadius: 21 },
    scrollContent: { paddingHorizontal: spacing.lg },
    heroBanner: { borderRadius: 24, marginBottom: 20 },
    heroRow: { flexDirection: 'row', gap: 14 },
    heroIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EDE7F6', justifyContent: 'center', alignItems: 'center' },
    heroTitle: { fontSize: 17, fontWeight: '900', color: '#7C4DFF', marginBottom: 6 },
    heroDesc: { fontSize: 13, fontWeight: '600', color: colors.text.secondary, lineHeight: 20 },
    sectionTitle: { fontSize: 17, fontWeight: '900', color: colors.text.primary, marginBottom: 12, marginTop: 4 },
    tipCard: { borderRadius: 22, marginBottom: 12 },
    tipTagRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    tipTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    tipTagText: { color: 'white', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
    tipMeta: { fontSize: 11, fontWeight: '600', color: colors.text.secondary },
    tipTitle: { fontSize: 16, fontWeight: '900', color: colors.text.primary, lineHeight: 22, marginBottom: 4 },
    tipSummary: { fontSize: 13, fontWeight: '600', color: colors.text.secondary, lineHeight: 21, marginTop: 8, marginBottom: 4 },
    expandBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10, alignSelf: 'flex-start' },
    expandBtnText: { fontSize: 13, fontWeight: '800', color: colors.primary },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
    statCard: { width: '47%', height: 100, borderRadius: 20 },
    statCardInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
    statValue: { fontSize: 20, fontWeight: '900', color: colors.text.primary },
    statLabel: { fontSize: 12, fontWeight: '700', color: colors.text.secondary },
});

export default KnowledgeHubScreen;
