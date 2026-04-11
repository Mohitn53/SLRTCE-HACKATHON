/**
 * Community Feed Screen — Kisaan Setu
 * The main hub: LinkedIn + Reddit + WhatsApp for Farmers
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    SafeAreaView, RefreshControl, Animated, Dimensions,
    TextInput, Modal, ScrollView, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MainBackground } from '../../../components/MainBackground';
import { GlassCard } from '../../../components/GlassCard';
import { colors, spacing } from '../../../core/theme';
import communityService from '../services/communityService';
import { useCommunity } from '../../../store/communityStore';
import { useAuth } from '../../../store/authStore';
import { useLanguage } from '../../../store/languageStore';

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { key: 'all',        label: 'All',       icon: 'apps' },
    { key: 'crops',      label: 'Crops',     icon: 'barley' },
    { key: 'soil',       label: 'Soil',      icon: 'shovel' },
    { key: 'irrigation', label: 'Water',     icon: 'water' },
    { key: 'pests',      label: 'Pests',     icon: 'bug' },
    { key: 'weather',    label: 'Weather',   icon: 'cloud-outline' },
];

const SORTS = [
    { key: 'latest',   label: 'Latest' },
    { key: 'trending', label: 'Trending' },
    { key: 'saved',    label: 'Most Saved' },
];

const CATEGORY_COLORS = {
    crops: '#2E7D32', soil: '#795548', irrigation: '#0288D1',
    pests: '#E53935', weather: '#5C6BC0', all: '#607D8B',
};

// ─── Post Card Component ──────────────────────────────────────────────────────
const PostCard = ({ post, onPress, t }) => {
    const { toggleLike, toggleSave, likedPostIds, savedPostIds } = useCommunity();
    const author = communityService.getUserById(post.userId);
    const liked = likedPostIds.has(post.id);
    const saved = savedPostIds.has(post.id);
    const catColor = CATEGORY_COLORS[post.category] || colors.primary;

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
    const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                onPress={() => onPress(post)}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
            >
                <GlassCard style={styles.postCard} intensity={30}>
                    {post.pinned && (
                        <View style={styles.pinnedBanner}>
                            <MaterialCommunityIcons name="pin" size={12} color={catColor} />
                            <Text style={[styles.pinnedText, { color: catColor }]}>{t('community.pinned')}</Text>
                        </View>
                    )}

                    {/* Author Row */}
                    <View style={styles.postHeader}>
                        <View style={[styles.avatarCircle, { backgroundColor: catColor + '20', borderColor: catColor + '40' }]}>
                            <Text style={styles.avatarEmoji}>{author?.avatar}</Text>
                        </View>
                        <View style={styles.authorMeta}>
                            <View style={styles.authorNameRow}>
                                <Text style={styles.authorName}>{author?.name || 'Farmer'}</Text>
                                {author?.badge && (
                                    <View style={[styles.badgePill, { backgroundColor: catColor + '15' }]}>
                                        <Text style={[styles.badgeText, { color: catColor }]}>{t('community.' + author.badge.toLowerCase().replace(' ', '')) || author.badge}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.postMeta}>{author?.district} · {post.time}</Text>
                        </View>
                        {post.solved && (
                            <View style={styles.solvedBadge}>
                                <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
                                <Text style={styles.solvedText}>{t('community.solved')}</Text>
                            </View>
                        )}
                    </View>

                    {/* Content */}
                    <Text style={styles.postTitle} numberOfLines={2}>{post.title}</Text>
                    <Text style={styles.postBody} numberOfLines={2}>{post.body}</Text>

                    {/* Tags */}
                    <View style={styles.tagsRow}>
                        <View style={[styles.catTag, { backgroundColor: catColor }]}>
                            <Text style={styles.catTagText}>{t(`community.${post.category}`).toUpperCase()}</Text>
                        </View>
                        {post.tags.slice(0, 2).map(tag => (
                            <View key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>#{tag}</Text>
                            </View>
                        ))}
                        {post.aiSuggested && (
                            <View style={styles.aiTag}>
                                <MaterialCommunityIcons name="robot-happy-outline" size={11} color="#7C4DFF" />
                                <Text style={styles.aiTagText}>AI</Text>
                            </View>
                        )}
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <TouchableOpacity style={styles.statBtn} onPress={() => toggleLike(post.id)}>
                            <MaterialCommunityIcons
                                name={liked ? "heart" : "heart-outline"}
                                size={18}
                                color={liked ? '#E53935' : colors.text.secondary}
                            />
                            <Text style={[styles.statText, liked && { color: '#E53935' }]}>
                                {post.likes + (liked ? 1 : 0)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.statBtn} onPress={() => onPress(post)}>
                            <MaterialCommunityIcons name="comment-outline" size={18} color={colors.text.secondary} />
                            <Text style={styles.statText}>{post.commentCount}</Text>
                        </TouchableOpacity>

                        <View style={styles.statBtn}>
                            <MaterialCommunityIcons name="eye-outline" size={16} color={colors.text.secondary} />
                            <Text style={styles.statText}>{post.views}</Text>
                        </View>

                        <View style={{ flex: 1 }} />

                        <TouchableOpacity onPress={() => toggleSave(post.id)}>
                            <MaterialCommunityIcons
                                name={saved ? "bookmark" : "bookmark-outline"}
                                size={20}
                                color={saved ? colors.primary : colors.text.secondary}
                            />
                        </TouchableOpacity>
                    </View>
                </GlassCard>
            </TouchableOpacity>
        </Animated.View>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const CommunityFeedScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { t } = useLanguage();
    const { posts, loadPosts, unreadCount } = useCommunity();
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeSort, setActiveSort] = useState('trending');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('feed'); // feed | forums | leaderboard | saved
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const CATEGORIES = [
        { key: 'all',        label: t('community.all'),       icon: 'apps' },
        { key: 'crops',      label: t('community.crops'),     icon: 'barley' },
        { key: 'soil',       label: t('community.soil'),      icon: 'shovel' },
        { key: 'irrigation', label: t('community.water'),     icon: 'water' },
        { key: 'pests',      label: t('community.pests'),     icon: 'bug' },
        { key: 'weather',    label: t('community.weather'),   icon: 'cloud-outline' },
    ];

    const SORTS = [
        { key: 'latest',   label: t('community.latest') },
        { key: 'trending', label: t('community.trending') },
        { key: 'saved',    label: t('community.mostSaved') },
    ];

    useEffect(() => {
        loadData();
    }, [activeCategory, activeSort]);

    const loadData = async () => {
        setLoading(true);
        await loadPosts({ category: activeCategory, sort: activeSort });
        setLoading(false);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [activeCategory, activeSort]);

    const filteredPosts = searchQuery
        ? posts.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : posts;

    const renderPost = ({ item }) => (
        <PostCard
            post={item}
            onPress={(post) => navigation.navigate('PostDetail', { post })}
            t={t}
        />
    );

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>

                {/* ── Header ── */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>{t("community.hub")}</Text>
                        <Text style={styles.headerSub}>{t("community.sub")}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.headerIconBtn}
                            onPress={() => navigation.navigate('KnowledgeHub')}
                        >
                            <MaterialCommunityIcons name="lightbulb-on-outline" size={22} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.headerIconBtn, unreadCount > 0 && styles.notifActive]}
                            onPress={() => navigation.navigate('CommunityNotifications')}
                        >
                            <MaterialCommunityIcons name="bell-outline" size={22} color={colors.primary} />
                            {unreadCount > 0 && (
                                <View style={styles.notifBadge}>
                                    <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Tab Bar ── */}
                <View style={styles.tabBarContainer}>
                    {[
                        { key: 'feed',        icon: 'newspaper-variant-outline', label: 'Feed' },
                        { key: 'forums',      icon: 'forum-outline', label: 'Forums' },
                        { key: 'leaderboard', icon: 'trophy-outline', label: 'Rank' },
                        { key: 'saved',       icon: 'bookmark-multiple-outline', label: 'Saved' },
                    ].map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <MaterialCommunityIcons
                                name={tab.icon}
                                size={20}
                                color={activeTab === tab.key ? colors.primary : colors.text.secondary}
                            />
                            <Text style={[styles.tabLabel, activeTab === tab.key && { color: colors.primary }]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ── Feed Tab ── */}
                {activeTab === 'feed' && (
                    <>
                        {/* Search */}
                        <View style={styles.searchRow}>
                            <GlassCard style={styles.searchCard} intensity={20} noPadding>
                                <View style={styles.searchInner}>
                                    <Ionicons name="search" size={18} color={colors.text.secondary} />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder={t("community.search")}
                                        placeholderTextColor={colors.text.muted}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                    {searchQuery.length > 0 && (
                                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                                            <Ionicons name="close-circle" size={18} color={colors.text.secondary} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </GlassCard>
                        </View>

                        {/* Category Filter */}
                        <View style={{ marginBottom: spacing.md, height: 42 }}>
                            <ScrollView
                                horizontal showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.categoryScroll}
                            >
                                {CATEGORIES.map((cat, index) => (
                                    <TouchableOpacity
                                        key={cat.key}
                                        onPress={() => setActiveCategory(cat.key)}
                                        style={[
                                            styles.categoryChip,
                                            { marginRight: index === CATEGORIES.length - 1 ? 0 : 8 },
                                            activeCategory === cat.key && {
                                                backgroundColor: CATEGORY_COLORS[cat.key],
                                                borderColor: CATEGORY_COLORS[cat.key],
                                            }
                                        ]}
                                    >
                                        <MaterialCommunityIcons
                                            name={cat.icon}
                                            size={16}
                                            color={activeCategory === cat.key ? 'white' : colors.text.secondary}
                                        />
                                        <Text style={[
                                            styles.categoryChipText,
                                            activeCategory === cat.key && { color: 'white' }
                                        ]}>
                                            {cat.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Sort Pills */}
                        <View style={{ marginBottom: spacing.sm, height: 35 }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
                                <Text style={styles.sortLabel}>{t("community.sortBy")}</Text>
                                {SORTS.map(s => (
                                    <TouchableOpacity
                                        key={s.key}
                                        onPress={() => setActiveSort(s.key)}
                                        style={[styles.sortPill, activeSort === s.key && styles.sortPillActive]}
                                    >
                                        <Text style={[styles.sortPillText, activeSort === s.key && { color: colors.primary }]}>
                                            {s.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Posts List */}
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={styles.loadingText}>{t("community.loading")}</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={filteredPosts}
                                renderItem={renderPost}
                                keyExtractor={item => item.id}
                                contentContainerStyle={styles.feedList}
                                showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        tintColor={colors.primary}
                                    />
                                }
                                ListEmptyComponent={
                                    <View style={styles.emptyContainer}>
                                        <MaterialCommunityIcons name="magnify-remove-outline" size={64} color={colors.text.muted} />
                                        <Text style={styles.emptyText}>{t("community.noPosts")}</Text>
                                        <Text style={styles.emptySubText}>{t("community.beFirst")}</Text>
                                    </View>
                                }
                            />
                        )}
                    </>
                )}

                {/* ── Forums Tab ── */}
                {activeTab === 'forums' && <ForumsTab navigation={navigation} />}

                {/* ── Leaderboard Tab ── */}
                {activeTab === 'leaderboard' && <LeaderboardTab />}

                {/* ── Saved Tab ── */}
                {activeTab === 'saved' && <SavedTab posts={posts} onPress={(p) => navigation.navigate('PostDetail', { post: p })} />}

                {/* ── FAB: Create Post ── */}
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('CreatePost')}
                    activeOpacity={0.85}
                >
                    <MaterialCommunityIcons name="pencil-plus" size={26} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        </MainBackground>
    );
};

// ─── Forums Tab ───────────────────────────────────────────────────────────────
const ForumsTab = ({ navigation }) => {
    const { t } = useLanguage();
    const [forums, setForums] = useState([]);
    useEffect(() => { communityService.getForums().then(setForums); }, []);

    return (
        <ScrollView contentContainerStyle={styles.forumsGrid} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>{t("community.topicChannels")}</Text>
            {forums.map(forum => (
                <TouchableOpacity key={forum.id} onPress={() => navigation.navigate('ForumThread', { forum })}>
                    <GlassCard style={styles.forumCard} intensity={25}>
                        <View style={[styles.forumIconBox, { backgroundColor: forum.color + '20' }]}>
                            <MaterialCommunityIcons name={forum.icon} size={28} color={forum.color} />
                        </View>
                        <View style={styles.forumInfo}>
                            <Text style={styles.forumName}>{forum.name}</Text>
                            <Text style={styles.forumMeta}>{forum.threads} {t("community.threads")} · {forum.members.toLocaleString()} {t("community.members")}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.text.muted} />
                    </GlassCard>
                </TouchableOpacity>
            ))}
            <View style={{ height: 120 }} />
        </ScrollView>
    );
};

// ─── Leaderboard Tab ─────────────────────────────────────────────────────────
const LeaderboardTab = () => {
    const { t } = useLanguage();
    const [leaders, setLeaders] = useState([]);
    useEffect(() => { communityService.getLeaderboard().then(setLeaders); }, []);

    const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

    return (
        <ScrollView contentContainerStyle={styles.leaderList} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>{t("community.topFarmers")}</Text>
            {leaders.map((user, index) => {
                const badgeMeta = communityService.getBadgeMeta(user.badge);
                return (
                    <GlassCard key={user.id} style={styles.leaderCard} intensity={25}>
                        <View style={styles.leaderRow}>
                            <Text style={[styles.rankNum, { color: medalColors[index] || colors.text.secondary }]}>
                                {index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                            </Text>
                            <View style={[styles.leaderAvatar, { backgroundColor: badgeMeta.color + '20' }]}>
                                <Text style={styles.leaderAvatarEmoji}>{user.avatar}</Text>
                            </View>
                            <View style={styles.leaderInfo}>
                                <Text style={styles.leaderName}>{user.name}</Text>
                                <View style={styles.leaderBadgeRow}>
                                    <MaterialCommunityIcons name={badgeMeta.icon} size={13} color={badgeMeta.color} />
                                    <Text style={[styles.leaderBadgeText, { color: badgeMeta.color }]}>{user.badge}</Text>
                                </View>
                            </View>
                            <View style={styles.pointsPill}>
                                <Text style={styles.pointsNum}>{user.points.toLocaleString()}</Text>
                                <Text style={styles.pointsLabel}>{t("community.pts")}</Text>
                            </View>
                        </View>
                    </GlassCard>
                );
            })}
            <View style={{ height: 120 }} />
        </ScrollView>
    );
};

// ─── Saved Tab ────────────────────────────────────────────────────────────────
const SavedTab = ({ posts, onPress }) => {
    const { t } = useLanguage();
    const { savedPostIds } = useCommunity();
    const saved = posts.filter(p => savedPostIds.has(p.id));
    if (saved.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="bookmark-outline" size={64} color={colors.text.muted} />
                <Text style={styles.emptyText}>{t("community.noSaved")}</Text>
                <Text style={styles.emptySubText}>{t("community.tapToSave")}</Text>
            </View>
        );
    }
    return (
        <FlatList
            data={saved}
            renderItem={({ item }) => <PostCard post={item} onPress={onPress} t={t} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.feedList}
            showsVerticalScrollIndicator={false}
        />
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
    headerTitle: { fontSize: 26, fontWeight: '900', color: colors.text.primary, letterSpacing: -0.5 },
    headerSub: { fontSize: 12, fontWeight: '700', color: colors.text.secondary, marginTop: 1 },
    headerRight: { flexDirection: 'row', gap: 8 },
    headerIconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
    notifActive: { backgroundColor: colors.primary + '15' },
    notifBadge: { position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#E53935', justifyContent: 'center', alignItems: 'center' },
    notifBadgeText: { color: 'white', fontSize: 9, fontWeight: '900' },

    // Tab Bar
    tabBarContainer: { flexDirection: 'row', marginHorizontal: spacing.lg, marginBottom: spacing.sm, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', overflow: 'hidden' },
    tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 2 },
    tabBtnActive: { backgroundColor: 'rgba(255,255,255,0.45)' },
    tabLabel: { fontSize: 10, fontWeight: '700', color: colors.text.secondary },

    // Search
    searchRow: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
    searchCard: { height: 46, borderRadius: 23 },
    searchInner: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: 10 },
    searchInput: { flex: 1, fontSize: 15, color: colors.text.primary, fontWeight: '600' },

    // Category Filter
    categoryScroll: { paddingHorizontal: spacing.lg },
    categoryChip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 95, height: 38, borderRadius: 19, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.3)', gap: 6 },
    categoryChipText: { fontSize: 13, fontWeight: '800', color: colors.text.secondary },

    // Sort
    sortRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, gap: 10 },
    sortLabel: { fontSize: 13, fontWeight: '800', color: colors.text.secondary },
    sortPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.03)' },
    sortPillActive: { backgroundColor: colors.primary + '15' },
    sortPillText: { fontSize: 12, fontWeight: '700', color: colors.text.secondary },

    // Feed
    feedList: { paddingHorizontal: spacing.lg, paddingBottom: 130 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
    loadingText: { marginTop: 12, fontSize: 14, fontWeight: '700', color: colors.text.secondary },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
    emptyText: { fontSize: 18, fontWeight: '800', color: colors.text.primary, marginTop: 16 },
    emptySubText: { fontSize: 13, fontWeight: '600', color: colors.text.secondary, textAlign: 'center', marginTop: 8 },

    // Post Card
    postCard: { marginBottom: 14, borderRadius: 24 },
    pinnedBanner: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
    pinnedText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
    postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
    avatarCircle: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5 },
    avatarEmoji: { fontSize: 22 },
    authorMeta: { flex: 1 },
    authorNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    authorName: { fontSize: 15, fontWeight: '800', color: colors.text.primary },
    badgePill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
    badgeText: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
    postMeta: { fontSize: 11, color: colors.text.secondary, fontWeight: '600', marginTop: 1 },
    solvedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    solvedText: { fontSize: 11, fontWeight: '800', color: '#4CAF50' },
    postTitle: { fontSize: 16, fontWeight: '900', color: colors.text.primary, lineHeight: 22, marginBottom: 6 },
    postBody: { fontSize: 13, fontWeight: '600', color: colors.text.secondary, lineHeight: 20, marginBottom: 12 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    catTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    catTagText: { color: 'white', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
    tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.06)' },
    tagText: { color: colors.text.secondary, fontSize: 11, fontWeight: '700' },
    aiTag: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, backgroundColor: '#EDE7F6' },
    aiTagText: { color: '#7C4DFF', fontSize: 10, fontWeight: '900' },
    statsRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 10, gap: 4 },
    statBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 4 },
    statText: { fontSize: 13, fontWeight: '700', color: colors.text.secondary },

    // Forums
    forumsGrid: { paddingHorizontal: spacing.lg, paddingTop: 4 },
    sectionLabel: { fontSize: 16, fontWeight: '900', color: colors.text.primary, marginBottom: 12, marginTop: 4 },
    forumCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderRadius: 20, paddingVertical: 4 },
    forumIconBox: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    forumInfo: { flex: 1 },
    forumName: { fontSize: 16, fontWeight: '800', color: colors.text.primary },
    forumMeta: { fontSize: 12, fontWeight: '600', color: colors.text.secondary, marginTop: 2 },

    // Leaderboard
    leaderList: { paddingHorizontal: spacing.lg, paddingTop: 4 },
    leaderCard: { marginBottom: 10, borderRadius: 20, paddingVertical: 4 },
    leaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    rankNum: { fontSize: 22, fontWeight: '900', width: 36, textAlign: 'center' },
    leaderAvatar: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
    leaderAvatarEmoji: { fontSize: 24 },
    leaderInfo: { flex: 1 },
    leaderName: { fontSize: 15, fontWeight: '800', color: colors.text.primary },
    leaderBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    leaderBadgeText: { fontSize: 11, fontWeight: '700' },
    pointsPill: { alignItems: 'center', backgroundColor: colors.primary + '15', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
    pointsNum: { fontSize: 18, fontWeight: '900', color: colors.primary },
    pointsLabel: { fontSize: 9, fontWeight: '800', color: colors.primary, textTransform: 'uppercase' },

    // FAB
    fab: {
        position: 'absolute', bottom: 110, right: spacing.lg,
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: colors.primary,
        justifyContent: 'center', alignItems: 'center',
        elevation: 10,
        zIndex: 999,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
});

export default CommunityFeedScreen;
