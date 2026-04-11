/**
 * Post Detail Screen — Full discussion thread with AI-assisted replies
 */
import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, TextInput, ActivityIndicator, KeyboardAvoidingView,
    Platform, Animated
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

const PostDetailScreen = ({ route }) => {
    const navigation = useNavigation();
    const { post } = route.params;
    const { toggleLike, toggleSave, likedPostIds, savedPostIds } = useCommunity();
    const author = communityService.getUserById(post.userId);
    const catColor = CATEGORY_COLORS[post.category] || colors.primary;

    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const scrollRef = useRef(null);

    const liked = likedPostIds.has(post.id);
    const saved = savedPostIds.has(post.id);

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        const data = await communityService.getComments(post.id);
        setComments(data);
    };

    const handleGetAISuggestion = async () => {
        setAiLoading(true);
        setAiSuggestion(null);
        try {
            const suggestion = await communityService.getAISuggestion(post.title, post.body);
            setAiSuggestion(suggestion);
            setCommentText(suggestion);
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim()) return;
        setSubmitting(true);
        try {
            const isAI = !!aiSuggestion && commentText === aiSuggestion;
            const newComment = await communityService.submitComment(post.id, commentText, isAI);
            setComments(prev => [newComment, ...prev]);
            setCommentText('');
            setAiSuggestion(null);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpvote = async (commentId) => {
        await communityService.upvoteComment(commentId);
        setComments(prev => prev.map(c =>
            c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
        ));
    };

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <GlassCard style={styles.backBtnGlass} intensity={25} noPadding>
                                <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
                            </GlassCard>
                        </TouchableOpacity>
                        <View style={[styles.catBadge, { backgroundColor: catColor }]}>
                            <Text style={styles.catBadgeText}>{post.category.toUpperCase()}</Text>
                        </View>
                    </View>

                    <ScrollView
                        ref={scrollRef}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Post Body */}
                        <GlassCard style={styles.postCard} intensity={30}>
                            {/* Author Row */}
                            <View style={styles.authorRow}>
                                <View style={[styles.avatar, { backgroundColor: catColor + '20', borderColor: catColor + '50' }]}>
                                    <Text style={styles.avatarEmoji}>{author?.avatar}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.authorName}>{author?.name}</Text>
                                    <Text style={styles.postMeta}>{author?.district} · {post.time} · {post.views} views</Text>
                                </View>
                                {post.solved && (
                                    <View style={styles.solvedBadge}>
                                        <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
                                        <Text style={styles.solvedText}>Solved</Text>
                                    </View>
                                )}
                            </View>

                            {/* Title and body */}
                            <Text style={styles.postTitle}>{post.title}</Text>
                            <Text style={styles.postBody}>{post.body}</Text>

                            {/* Tags */}
                            <View style={styles.tagsRow}>
                                {post.tags.map(tag => (
                                    <View key={tag} style={styles.tag}>
                                        <Text style={styles.tagText}>#{tag}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Like / Save Row */}
                            <View style={styles.actionsRow}>
                                <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(post.id)}>
                                    <MaterialCommunityIcons
                                        name={liked ? "heart" : "heart-outline"}
                                        size={20}
                                        color={liked ? '#E53935' : colors.text.secondary}
                                    />
                                    <Text style={[styles.actionText, liked && { color: '#E53935' }]}>
                                        {post.likes + (liked ? 1 : 0)} Likes
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionBtn}>
                                    <MaterialCommunityIcons name="share-outline" size={20} color={colors.text.secondary} />
                                    <Text style={styles.actionText}>Share</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.actionBtn} onPress={() => toggleSave(post.id)}>
                                    <MaterialCommunityIcons
                                        name={saved ? "bookmark" : "bookmark-outline"}
                                        size={20}
                                        color={saved ? colors.primary : colors.text.secondary}
                                    />
                                    <Text style={[styles.actionText, saved && { color: colors.primary }]}>
                                        {saved ? 'Saved' : 'Save'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </GlassCard>

                        {/* AI Insight Banner */}
                        {post.aiSuggested && (
                            <GlassCard style={styles.aiBanner} intensity={20}>
                                <View style={styles.aiBannerRow}>
                                    <View style={styles.aiIconBox}>
                                        <MaterialCommunityIcons name="robot-happy-outline" size={24} color="#7C4DFF" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.aiBannerTitle}>AI Tagged Discussion</Text>
                                        <Text style={styles.aiBannerDesc}>Kisaan AI has analysed this issue and is ready to suggest solutions based on live weather & soil data.</Text>
                                    </View>
                                </View>
                            </GlassCard>
                        )}

                        {/* Comments Section */}
                        <Text style={styles.commentsHeader}>
                            {comments.length} Replies
                        </Text>

                        {comments.map(comment => {
                            const commenter = communityService.getUserById(comment.userId);
                            return (
                                <GlassCard key={comment.id} style={[styles.commentCard, comment.isAccepted && styles.acceptedBorder]} intensity={20}>
                                    {comment.isAccepted && (
                                        <View style={styles.acceptedTag}>
                                            <MaterialCommunityIcons name="check-decagram" size={13} color="#4CAF50" />
                                            <Text style={styles.acceptedText}>Accepted Answer</Text>
                                        </View>
                                    )}
                                    <View style={styles.commentHeader}>
                                        {comment.isAI ? (
                                            <View style={styles.aiCommentAvatar}>
                                                <MaterialCommunityIcons name="robot-happy" size={20} color="#7C4DFF" />
                                            </View>
                                        ) : (
                                            <View style={styles.commenterAvatar}>
                                                <Text style={styles.avatarEmoji}>{commenter?.avatar || '🧑‍🌾'}</Text>
                                            </View>
                                        )}
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.commenterName}>
                                                {comment.isAI ? 'Kisaan AI Expert' : commenter?.name || 'Farmer'}
                                                {comment.isAI && (
                                                    <Text style={styles.aiLabel}> • AI</Text>
                                                )}
                                            </Text>
                                            <Text style={styles.commentTime}>{comment.time}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.commentText}>{comment.text}</Text>
                                    <View style={styles.commentActions}>
                                        <TouchableOpacity
                                            style={styles.upvoteBtn}
                                            onPress={() => handleUpvote(comment.id)}
                                        >
                                            <MaterialCommunityIcons name="arrow-up-bold-outline" size={16} color={colors.primary} />
                                            <Text style={styles.upvoteCount}>{comment.upvotes}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </GlassCard>
                            );
                        })}
                        <View style={{ height: 120 }} />
                    </ScrollView>

                    {/* Reply Composer */}
                    <GlassCard style={styles.composer} intensity={50} noPadding>
                        {aiLoading && (
                            <View style={styles.aiLoadingBar}>
                                <ActivityIndicator size="small" color="#7C4DFF" />
                                <Text style={styles.aiLoadingText}>Kisaan AI is generating a response...</Text>
                            </View>
                        )}
                        {aiSuggestion && (
                            <View style={styles.aiSuggestionBar}>
                                <MaterialCommunityIcons name="robot-happy-outline" size={14} color="#7C4DFF" />
                                <Text style={styles.aiSuggestionLabel}>AI suggestion applied — edit before posting</Text>
                            </View>
                        )}
                        <View style={styles.composerRow}>
                            <TextInput
                                style={styles.composerInput}
                                placeholder="Add your answer or insight..."
                                placeholderTextColor={colors.text.muted}
                                value={commentText}
                                onChangeText={(t) => { setCommentText(t); setAiSuggestion(null); }}
                                multiline
                                maxLength={500}
                            />
                            <View style={styles.composerActions}>
                                <TouchableOpacity
                                    style={styles.aiBtn}
                                    onPress={handleGetAISuggestion}
                                    disabled={aiLoading}
                                >
                                    <MaterialCommunityIcons name="robot-happy-outline" size={20} color="#7C4DFF" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.sendBtn, !commentText.trim() && styles.sendBtnDisabled]}
                                    onPress={handleSubmitComment}
                                    disabled={!commentText.trim() || submitting}
                                >
                                    {submitting
                                        ? <ActivityIndicator size="small" color="white" />
                                        : <Ionicons name="send" size={18} color="white" />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </GlassCard>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </MainBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: 12 },
    backBtn: {},
    backBtnGlass: { width: 42, height: 42, borderRadius: 21 },
    catBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
    catBadgeText: { color: 'white', fontWeight: '900', fontSize: 11, letterSpacing: 0.5 },
    scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: 20 },

    postCard: { borderRadius: 24, marginBottom: 14 },
    authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
    avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5 },
    avatarEmoji: { fontSize: 22 },
    authorName: { fontSize: 15, fontWeight: '800', color: colors.text.primary },
    postMeta: { fontSize: 11, fontWeight: '600', color: colors.text.secondary, marginTop: 1 },
    solvedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    solvedText: { fontSize: 11, fontWeight: '800', color: '#4CAF50' },
    postTitle: { fontSize: 20, fontWeight: '900', color: colors.text.primary, lineHeight: 28, marginBottom: 10 },
    postBody: { fontSize: 14, fontWeight: '600', color: colors.text.secondary, lineHeight: 22, marginBottom: 14 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
    tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.06)' },
    tagText: { color: colors.text.secondary, fontSize: 12, fontWeight: '700' },
    actionsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', paddingTop: 12, gap: 16 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    actionText: { fontSize: 13, fontWeight: '700', color: colors.text.secondary },

    aiBanner: { borderRadius: 20, marginBottom: 16 },
    aiBannerRow: { flexDirection: 'row', gap: 12 },
    aiIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EDE7F6', justifyContent: 'center', alignItems: 'center' },
    aiBannerTitle: { fontSize: 14, fontWeight: '900', color: '#7C4DFF', marginBottom: 4 },
    aiBannerDesc: { fontSize: 12, fontWeight: '600', color: colors.text.secondary, lineHeight: 18 },

    commentsHeader: { fontSize: 16, fontWeight: '900', color: colors.text.primary, marginBottom: 12 },
    commentCard: { borderRadius: 20, marginBottom: 10 },
    acceptedBorder: { borderLeftWidth: 3, borderLeftColor: '#4CAF50' },
    acceptedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
    acceptedText: { fontSize: 11, fontWeight: '800', color: '#4CAF50' },
    commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
    commenterAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.06)', justifyContent: 'center', alignItems: 'center' },
    aiCommentAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EDE7F6', justifyContent: 'center', alignItems: 'center' },
    commenterName: { fontSize: 14, fontWeight: '800', color: colors.text.primary },
    aiLabel: { color: '#7C4DFF', fontWeight: '900' },
    commentTime: { fontSize: 11, fontWeight: '600', color: colors.text.secondary },
    commentText: { fontSize: 14, fontWeight: '600', color: colors.text.primary, lineHeight: 22 },
    commentActions: { flexDirection: 'row', marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 8 },
    upvoteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    upvoteCount: { fontSize: 13, fontWeight: '800', color: colors.primary },

    composer: { marginHorizontal: spacing.lg, marginBottom: Platform.OS === 'ios' ? 20 : spacing.lg, borderRadius: 24 },
    aiLoadingBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 10 },
    aiLoadingText: { fontSize: 12, fontWeight: '700', color: '#7C4DFF' },
    aiSuggestionBar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EDE7F6', paddingHorizontal: 16, paddingVertical: 6 },
    aiSuggestionLabel: { fontSize: 11, fontWeight: '700', color: '#7C4DFF' },
    composerRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 10, alignItems: 'flex-end' },
    composerInput: { flex: 1, fontSize: 14, color: colors.text.primary, fontWeight: '600', maxHeight: 100, minHeight: 40 },
    composerActions: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
    aiBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EDE7F6', justifyContent: 'center', alignItems: 'center' },
    sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
    sendBtnDisabled: { opacity: 0.4 },
});

export default PostDetailScreen;
