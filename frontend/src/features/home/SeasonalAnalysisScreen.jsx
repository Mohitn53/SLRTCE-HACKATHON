import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../core/theme';
import { MainBackground } from '../../components/MainBackground';
import { GlassCard } from '../../components/GlassCard';

const { width } = Dimensions.get('window');

const SEASONAL_DATA = [
    { 
        crop: 'Wheat', 
        suitability: 94, 
        waterNeed: 'Medium', 
        growthCycle: '120 Days', 
        profitability: 'High', 
        description: 'Excellent soil moisture (0.18) and forecasted moderate temperatures make wheat the top choice for this cycle.',
        nutrients: { N: 85, P: 60, K: 45 }
    },
    { 
        crop: 'Mustard', 
        suitability: 82, 
        waterNeed: 'Low', 
        growthCycle: '110 Days', 
        profitability: 'Steady', 
        description: 'Ideal if water conservation is a priority. High market demand expected in regional mandis.',
        nutrients: { N: 70, P: 40, K: 30 }
    },
    { 
        crop: 'Barley', 
        suitability: 75, 
        waterNeed: 'Low', 
        growthCycle: '100 Days', 
        profitability: 'Moderate', 
        description: 'Resilient to minor soil PH fluctuations observed in your region.',
        nutrients: { N: 60, P: 50, K: 40 }
    }
];

export default function SeasonalAnalysisScreen() {
    const navigation = useNavigation();

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <GlassCard style={styles.iconGlass} intensity={40} noPadding={true}>
                            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
                        </GlassCard>
                    </TouchableOpacity>
                    <Text style={styles.title}>Seasonal Insights</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Hero Metric */}
                    <GlassCard style={styles.heroCard} intensity={30}>
                        <View style={styles.heroRow}>
                            <View style={styles.heroMain}>
                                <Text style={styles.heroLabel}>Overall Yield Index</Text>
                                <Text style={styles.heroValue}>88%</Text>
                            </View>
                            <View style={styles.heroDivider} />
                            <View style={styles.heroSub}>
                                <Text style={styles.heroSubLabel}>Market Trend</Text>
                                <View style={styles.trendBadge}>
                                    <Ionicons name="trending-up" size={16} color={colors.success} />
                                    <Text style={styles.trendText}>Bullish</Text>
                                </View>
                            </View>
                        </View>
                    </GlassCard>

                    <Text style={styles.sectionLabel}>Top Recommendations</Text>

                    {SEASONAL_DATA.map((item, idx) => (
                        <GlassCard key={idx} style={styles.cropCard} intensity={25}>
                            <View style={styles.cropHeader}>
                                <View style={styles.cropTitleBox}>
                                    <Text style={styles.cropName}>{item.crop}</Text>
                                    <View style={styles.suitabilityBadge}>
                                        <Text style={styles.suitabilityText}>{item.suitability}% Match</Text>
                                    </View>
                                </View>
                                <MaterialCommunityIcons 
                                    name={item.crop === 'Wheat' ? 'barley' : item.crop === 'Mustard' ? 'flower-tulip' : 'sprout'} 
                                    size={32} 
                                    color={colors.primary} 
                                />
                            </View>

                            <Text style={styles.cropDesc}>{item.description}</Text>

                            <View style={styles.metricGrid}>
                                <View style={styles.metricItem}>
                                    <MaterialCommunityIcons name="water-pump" size={18} color={colors.secondary} />
                                    <Text style={styles.metricVal}>{item.waterNeed}</Text>
                                    <Text style={styles.metricLab}>Irrigation</Text>
                                </View>
                                <View style={styles.metricItem}>
                                    <MaterialCommunityIcons name="timer-outline" size={18} color={colors.warning} />
                                    <Text style={styles.metricVal}>{item.growthCycle}</Text>
                                    <Text style={styles.metricLab}>Cycle</Text>
                                </View>
                                <View style={styles.metricItem}>
                                    <MaterialCommunityIcons name="currency-usd" size={18} color={colors.success} />
                                    <Text style={styles.metricVal}>{item.profitability}</Text>
                                    <Text style={styles.metricLab}>Profit</Text>
                                </View>
                            </View>

                            <View style={styles.nutrientSection}>
                                <Text style={styles.nutrientLabel}>NHP Nutrient Requirement:</Text>
                                <View style={styles.nutrientBar}>
                                    <View style={[styles.barLayer, { width: `${item.nutrients.N}%`, backgroundColor: '#4CAF50' }]} />
                                    <View style={[styles.barLayer, { width: `${item.nutrients.P}%`, backgroundColor: '#8BC34A' }]} />
                                    <View style={[styles.barLayer, { width: `${item.nutrients.K}%`, backgroundColor: '#CDDC39' }]} />
                                </View>
                            </View>
                        </GlassCard>
                    ))}

                    {/* AI Advisory */}
                    <GlassCard style={styles.advisoryCard} intensity={20}>
                        <View style={styles.advisoryHeader}>
                            <MaterialCommunityIcons name="robot-happy-outline" size={24} color={colors.primary} />
                            <Text style={styles.advisoryTitle}>AI Farmer Advisory</Text>
                        </View>
                        <Text style={styles.advisoryText}>
                            Based on regional crop clustering, your neighbor nodes have successfully started sowing early Wheat variants. We recommend completing the primary soil preparation by the 15th of this month.
                        </Text>
                    </GlassCard>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </MainBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    iconGlass: { width: 44, height: 44, borderRadius: 22 },
    title: { fontSize: 22, fontWeight: '900', color: colors.text.primary, letterSpacing: -0.5 },
    scrollContent: { padding: spacing.lg },
    heroCard: { padding: spacing.xl, borderRadius: 32, marginBottom: spacing.xl },
    heroRow: { flexDirection: 'row', alignItems: 'center' },
    heroMain: { flex: 1.2 },
    heroLabel: { fontSize: 13, color: colors.text.secondary, fontWeight: '800', letterSpacing: 1 },
    heroValue: { fontSize: 38, fontWeight: '900', color: colors.primary, marginTop: 4 },
    heroDivider: { width: 1, height: 50, backgroundColor: 'rgba(0,0,0,0.05)', marginHorizontal: 20 },
    heroSub: { flex: 1 },
    heroSubLabel: { fontSize: 11, color: colors.text.secondary, fontWeight: '800', letterSpacing: 1 },
    trendBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    trendText: { marginLeft: 6, fontSize: 16, fontWeight: '900', color: colors.success },
    sectionLabel: { fontSize: 18, fontWeight: '900', color: colors.text.primary, marginBottom: spacing.lg },
    cropCard: { padding: spacing.xl, borderRadius: 32, marginBottom: spacing.lg },
    cropHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
    cropTitleBox: { flex: 1 },
    cropName: { fontSize: 24, fontWeight: '900', color: colors.text.primary },
    suitabilityBadge: { backgroundColor: colors.primary + '15', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
    suitabilityText: { fontSize: 12, color: colors.primary, fontWeight: '900' },
    cropDesc: { fontSize: 14, color: colors.text.secondary, lineHeight: 22, fontWeight: '600', marginBottom: 20 },
    metricGrid: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.03)', paddingVertical: 15 },
    metricItem: { alignItems: 'center', flex: 1 },
    metricVal: { fontSize: 15, fontWeight: '900', color: colors.text.primary, marginTop: 4 },
    metricLab: { fontSize: 10, color: colors.text.secondary, fontWeight: '800', marginTop: 2 },
    nutrientSection: { marginTop: 20 },
    nutrientLabel: { fontSize: 12, fontWeight: '800', color: colors.text.primary, marginBottom: 8 },
    nutrientBar: { height: 10, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 5, flexDirection: 'row', overflow: 'hidden' },
    barLayer: { height: '100%' },
    advisoryCard: { padding: spacing.lg, borderRadius: 25, borderLeftWidth: 5, borderLeftColor: colors.primary },
    advisoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    advisoryTitle: { marginLeft: 10, fontSize: 14, fontWeight: '900', color: colors.text.primary },
    advisoryText: { fontSize: 13, color: colors.text.secondary, lineHeight: 20, fontWeight: '500' }
});
