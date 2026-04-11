/**
 * Forum Thread Screen — topic-specific discussion channel
 */
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    SafeAreaView, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MainBackground } from '../../../components/MainBackground';
import { GlassCard } from '../../../components/GlassCard';
import { colors, spacing } from '../../../core/theme';
import communityService from '../services/communityService';
import { useCommunity } from '../../../store/communityStore';

const CATEGORY_COLORS = {
    crops: '#2E7D32', soil: '#795548', irrigation: '#0288D1',
    pests: '#E53935', weather: '#5C6BC0', all: '#607D8B',
};

const ForumThreadScreen = ({ route }) => {
    const navigation = useNavigation();
    const { forum } = route.params;
    const { toggleLike, likedPostIds } = useCommunity();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        communityService.getForumPosts(forum.category).then(data => {
            setPosts(data);
            setLoading(false);
        });
    }, []);

    const renderPost = ({ item }) => {
        const author = communityService.getUserById(item.userId);
        const liked = likedPostIds.has(item.id);
        const catColor = CATEGORY_COLORS[item.category] || colors.primary;

        return (
            <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { post: item })}>
                <GlassCard style={styles.postCard} intensity={25}>
                    <View style={styles.postHeader}>
                        <View style={[styles.avatar, { backgroundColor: catColor + '20' }]}>
                            <Text style={styles.avatarEmoji}>{author?.avatar}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.authorName}>{author?.name}</Text>
                            <Text style={styles.postMeta}>{author?.district} · {item.time}</Text>
                        </View>
                        {item.solved && (
                            <View style={styles.solvedBadge}>
                                <MaterialCommunityIcons name="check-circle" size={14} color="#4CAF50" />
                                <Text style={styles.solvedText}>Solved</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.postTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.postBody} numberOfLines={2}>{item.body}</Text>

                    <View style={styles.statsRow}>
                        <TouchableOpacity
                            style={styles.statBtn}
                            onPress={() => toggleLike(item.id)}
                        >
                            <MaterialCommunityIcons
                                name={liked ? 'heart' : 'heart-outline'}
                                size={16}
                                color={liked ? '#E53935' : colors.text.secondary}
                            />
                            <Text style={styles.statText}>{item.likes + (liked ? 1 : 0)}</Text>
                        </TouchableOpacity>
                        <View style={styles.statBtn}>
                            <MaterialCommunityIcons name="comment-outline" size={16} color={colors.text.secondary} />
                            <Text style={styles.statText}>{item.commentCount}</Text>
                        </View>
                        <View style={styles.statBtn}>
                            <MaterialCommunityIcons name="eye-outline" size={15} color={colors.text.secondary} />
                            <Text style={styles.statText}>{item.views}</Text>
                        </View>
                    </View>
                </GlassCard>
            </TouchableOpacity>
        );
    };

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <GlassCard style={styles.backBtn} intensity={25} noPadding>
                            <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
                        </GlassCard>
                    </TouchableOpacity>
                    <View style={styles.headerMid}>
                        <View style={[styles.forumIcon, { backgroundColor: forum.color + '20' }]}>
                            <MaterialCommunityIcons name={forum.icon} size={22} color={forum.color} />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>{forum.name}</Text>
                            <Text style={styles.headerSub}>{forum.threads} threads · {forum.members.toLocaleString()} members</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.newPostBtn}
                        onPress={() => navigation.navigate('CreatePost')}
                    >
                        <MaterialCommunityIcons name="pencil-plus" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={posts}
                        renderItem={renderPost}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons name="forum-outline" size={56} color={colors.text.muted} />
                                <Text style={styles.emptyText}>No threads yet in this forum</Text>
                                <Text style={styles.emptySubText}>Be the first to start a discussion!</Text>
                            </View>
                        }
                    />
                )}
            </SafeAreaView>
        </MainBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
        gap: 12,
    },
    backBtn: { width: 42, height: 42, borderRadius: 21 },
    headerMid: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
    forumIcon: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '900', color: colors.text.primary },
    headerSub: { fontSize: 11, fontWeight: '600', color: colors.text.secondary, marginTop: 1 },
    newPostBtn: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: colors.primary,
        justifyContent: 'center', alignItems: 'center',
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
    postCard: { borderRadius: 22, marginBottom: 12 },
    postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
    avatar: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
    avatarEmoji: { fontSize: 20 },
    authorName: { fontSize: 14, fontWeight: '800', color: colors.text.primary },
    postMeta: { fontSize: 11, fontWeight: '600', color: colors.text.secondary },
    solvedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    solvedText: { fontSize: 10, fontWeight: '800', color: '#4CAF50' },
    postTitle: { fontSize: 15, fontWeight: '900', color: colors.text.primary, lineHeight: 21, marginBottom: 5 },
    postBody: { fontSize: 13, fontWeight: '600', color: colors.text.secondary, lineHeight: 19, marginBottom: 10 },
    statsRow: {
        flexDirection: 'row', gap: 12,
        borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 8,
    },
    statBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statText: { fontSize: 12, fontWeight: '700', color: colors.text.secondary },
    emptyContainer: { alignItems: 'center', paddingTop: 80 },
    emptyText: { fontSize: 17, fontWeight: '800', color: colors.text.primary, marginTop: 14 },
    emptySubText: { fontSize: 13, fontWeight: '600', color: colors.text.secondary, marginTop: 6 },
});

export default ForumThreadScreen;
