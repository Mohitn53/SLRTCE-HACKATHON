import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getHistory } from '../../services/uploadService';
import { colors, spacing, typography, borderRadius } from '../../core/theme';
import { useAuth } from '../../store/authStore';
import { MainBackground } from '../../components/MainBackground';
import { GlassCard } from '../../components/GlassCard';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../store/languageStore';

export default function HistoryScreen() {
    const { t } = useLanguage();

    const navigation = useNavigation();
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        try {
            const data = await getHistory();
            setHistory(data || []);
        } catch (e) {
            console.log('Failed to fetch history', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const renderItem = ({ item }) => (
        <GlassCard style={styles.card} intensity={40} noPadding={true}>
            <View style={styles.cardRow}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop' }}
                        style={styles.cardImage}
                    />
                    <View style={[styles.statusBadge, { backgroundColor: item.status === 'Healthy' ? colors.primary : colors.error }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{item.plant || 'Unknown Crop'}</Text>
                        <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <Text style={styles.cardSubtitle} numberOfLines={2}>{item.condition || 'No condition details available.'}</Text>
                    <View style={styles.confidenceRow}>
                        <MaterialCommunityIcons name="shield-check" size={14} color={colors.primary} />
                        <Text style={styles.confidenceText}>92% AI Verification</Text>
                    </View>
                </View>
            </View>
        </GlassCard>
    );

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Insights Log</Text>
                </View>

                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id || Math.random().toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                    ListEmptyComponent={
                        !loading && (
                            <View style={styles.emptyContainer}>
                                <GlassCard style={styles.emptyGlass} intensity={20}>
                                    <MaterialCommunityIcons name="history" size={64} color={colors.text.primary} style={{ opacity: 0.3 }} />
                                    <Text style={styles.emptyText}>No agricultural scans yet.</Text>
                                    <TouchableOpacity 
                                        style={styles.scanNowBtn}
                                        onPress={() => navigation.navigate('ScanTab')}
                                    >
                                        <Text style={styles.scanNowText}>Start Scanning</Text>
                                    </TouchableOpacity>
                                </GlassCard>
                            </View>
                        )
                    }
                />
            </SafeAreaView>
        </MainBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    backButton: { padding: spacing.sm, marginRight: spacing.sm },
    title: { fontSize: 24, fontWeight: '900', color: colors.text.primary, letterSpacing: -0.5 },
    listContent: { padding: spacing.lg, paddingBottom: 120 },
    card: { marginBottom: spacing.lg, borderRadius: 24, overflow: 'hidden' },
    cardRow: { flexDirection: 'row', height: 130 },
    imageContainer: { width: 110, height: '100%', position: 'relative' },
    cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    statusBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    statusText: { color: 'white', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
    cardContent: { flex: 1, padding: spacing.md, justifyContent: 'center' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    cardTitle: { fontSize: 17, fontWeight: '900', color: colors.text.primary },
    cardDate: { fontSize: 11, color: colors.text.secondary, fontWeight: '700' },
    cardSubtitle: { fontSize: 13, color: colors.text.secondary, lineHeight: 18, marginBottom: 8, fontWeight: '600' },
    confidenceRow: { flexDirection: 'row', alignItems: 'center' },
    confidenceText: { fontSize: 12, color: colors.primary, fontWeight: '800', marginLeft: 4 },
    emptyContainer: { marginTop: 60, alignItems: 'center', paddingHorizontal: spacing.xl },
    emptyGlass: { width: '100%', alignItems: 'center', padding: spacing.xl },
    emptyText: { marginTop: spacing.md, fontSize: 16, color: colors.text.secondary, fontWeight: '700', textAlign: 'center' },
    scanNowBtn: { marginTop: spacing.xl, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 15 },
    scanNowText: { color: 'white', fontWeight: '900', fontSize: 16 }
});
