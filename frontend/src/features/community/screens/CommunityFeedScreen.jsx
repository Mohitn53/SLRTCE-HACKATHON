import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { MainBackground } from '../../../components/MainBackground';
import { GlassCard } from '../../../components/GlassCard';
import { colors, spacing, typography, borderRadius } from '../../../core/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CommunityFeedScreen = () => {
    const posts = [
        { id: '1', author: 'Rahul Kumar', crop: 'Wheat', issue: 'Yellowing of leaves', time: '2h ago', likes: 12, comments: 4 },
        { id: '2', author: 'Sonal Singh', crop: 'Tomato', issue: 'Pest attack on fruits', time: '5h ago', likes: 24, comments: 10 },
    ];

    const renderItem = ({ item }) => (
        <GlassCard style={styles.postCard}>
            <View style={styles.postHeader}>
                <View style={styles.avatar} />
                <View>
                    <Text style={styles.authorName}>{item.author}</Text>
                    <Text style={styles.postTime}>{item.time}</Text>
                </View>
            </View>
            <Text style={styles.postTitle}>{item.issue}</Text>
            <View style={styles.tag}>
                <Text style={styles.tagText}>{item.crop}</Text>
            </View>
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <MaterialCommunityIcons name="heart-outline" size={18} color={colors.primary} />
                    <Text style={styles.statText}>{item.likes}</Text>
                </View>
                <View style={styles.stat}>
                    <MaterialCommunityIcons name="comment-outline" size={18} color={colors.primary} />
                    <Text style={styles.statText}>{item.comments}</Text>
                </View>
            </View>
        </GlassCard>
    );

    return (
        <MainBackground>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Community Hub</Text>
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
                <TouchableOpacity style={styles.fab}>
                    <MaterialCommunityIcons name="plus" size={32} color="white" />
                </TouchableOpacity>
            </View>
        </MainBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    headerTitle: {
        ...typography.title,
        color: colors.text.primary,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    list: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 100,
    },
    postCard: {
        marginBottom: spacing.lg,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.accent,
        marginRight: spacing.md,
    },
    authorName: {
        ...typography.body,
        fontWeight: '700',
        color: colors.text.primary,
    },
    postTime: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    postTitle: {
        ...typography.subtitle,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    tag: {
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
        alignSelf: 'flex-start',
        marginBottom: spacing.md,
    },
    tagText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 12,
    },
    statsRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: spacing.sm,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.lg,
    },
    statText: {
        marginLeft: 4,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        bottom: 120,
        right: spacing.lg,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    }
});

export default CommunityFeedScreen;
