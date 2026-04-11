/**
 * Notifications Screen — Smart community alerts
 */
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MainBackground } from '../../../components/MainBackground';
import { GlassCard } from '../../../components/GlassCard';
import { colors, spacing } from '../../../core/theme';
import { useCommunity } from '../../../store/communityStore';

const NOTIF_ICONS = {
    reply:   { icon: 'comment-text-outline', color: '#0288D1' },
    trend:   { icon: 'trending-up',          color: '#E53935' },
    weather: { icon: 'weather-lightning',     color: '#F9A825' },
    ai:      { icon: 'robot-happy-outline',   color: '#7C4DFF' },
    badge:   { icon: 'medal-outline',         color: '#F9A825' },
};

const getNotifType = (text) => {
    if (text.includes('replied')) return 'reply';
    if (text.includes('trending')) return 'trend';
    if (text.includes('Weather')) return 'weather';
    if (text.includes('AI') || text.includes('Expert')) return 'ai';
    return 'trend';
};

const CommunityNotificationsScreen = () => {
    const navigation = useNavigation();
    const { notifications, markAllNotificationsRead } = useCommunity();

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <GlassCard style={styles.backBtn} intensity={25} noPadding>
                            <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
                        </GlassCard>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <TouchableOpacity onPress={markAllNotificationsRead}>
                        <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const type = getNotifType(item.text);
                        const iconMeta = NOTIF_ICONS[type];
                        return (
                            <GlassCard style={[styles.notifCard, !item.read && styles.unreadCard]} intensity={20}>
                                <View style={styles.notifRow}>
                                    <View style={[styles.notifIcon, { backgroundColor: iconMeta.color + '20' }]}>
                                        <MaterialCommunityIcons name={iconMeta.icon} size={22} color={iconMeta.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.notifText}>{item.text}</Text>
                                        <Text style={styles.notifTime}>{item.time}</Text>
                                    </View>
                                    {!item.read && <View style={styles.unreadDot} />}
                                </View>
                            </GlassCard>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <MaterialCommunityIcons name="bell-off-outline" size={56} color={colors.text.muted} />
                            <Text style={styles.emptyText}>No notifications yet</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </MainBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    headerTitle: { fontSize: 20, fontWeight: '900', color: colors.text.primary },
    backBtn: { width: 42, height: 42, borderRadius: 21 },
    markAllText: { fontSize: 13, fontWeight: '800', color: colors.primary },
    list: { paddingHorizontal: spacing.lg, paddingBottom: 80 },
    notifCard: { borderRadius: 20, marginBottom: 10 },
    unreadCard: { borderLeftWidth: 3, borderLeftColor: colors.primary },
    notifRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    notifIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    notifText: { fontSize: 14, fontWeight: '700', color: colors.text.primary, lineHeight: 20 },
    notifTime: { fontSize: 12, fontWeight: '600', color: colors.text.secondary, marginTop: 2 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
    empty: { alignItems: 'center', paddingTop: 80 },
    emptyText: { fontSize: 16, fontWeight: '700', color: colors.text.secondary, marginTop: 12 },
});

export default CommunityNotificationsScreen;
