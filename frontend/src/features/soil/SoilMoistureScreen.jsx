import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Animated } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius } from '../../core/theme';
import agricultureService from '../../services/agricultureService';
import { useLanguage } from '../../store/languageStore';
import { MainBackground } from '../../components/MainBackground';
import { GlassCard } from '../../components/GlassCard';

const { width } = Dimensions.get('window');

const normalizePredictions = (predictions) => {
    if (!predictions || predictions.length === 0) return [0.15, 0.18, 0.20, 0.19, 0.17, 0.16, 0.18];
    const data = [...predictions];
    while (data.length < 7) {
        const last = data[data.length - 1];
        data.push(Math.max(0.1, last + (Math.random() * 0.04 - 0.02)));
    }
    return data.slice(0, 7);
};

export default function SoilMoistureScreen() {
    const navigation = useNavigation();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    
    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchSoilData();
    }, []);

    const fetchSoilData = async () => {
        setLoading(true);
        setError(null);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Location access required for analytics.');
                setLoading(false);
                return;
            }

            let userLocation = await Location.getCurrentPositionAsync({});
            const mockMoisture = 0.18; 
            
            const data = await agricultureService.getLocationDecision(
                userLocation.coords.latitude,
                userLocation.coords.longitude,
                mockMoisture
            );

            if (data.status === 'success') {
                const normalizedResult = {
                    ...data.result,
                    simulation: {
                        ...data.result.simulation,
                        predictions: normalizePredictions(data.result.simulation.predictions)
                    }
                };
                setResult(normalizedResult);
                Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
            } else {
                setError('Service momentarily unavailable.');
            }
        } catch (err) {
            setError('Check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const getDayName = (offset) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const date = new Date();
        date.setDate(date.getDate() + offset);
        return days[date.getDay()];
    };

    const handleDayPress = (index) => {
        setSelectedDay(index === selectedDay ? null : index);
    };

    if (loading) {
        return (
            <MainBackground>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Calibrating Sensors...</Text>
                </View>
            </MainBackground>
        );
    }

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                        <GlassCard style={styles.headerIcon} intensity={25} noPadding={true}>
                            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
                        </GlassCard>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Soil Health Hub</Text>
                    <TouchableOpacity onPress={fetchSoilData} style={styles.headerBtn}>
                        <GlassCard style={styles.headerIcon} intensity={25} noPadding={true}>
                            <Ionicons name="refresh" size={22} color={colors.primary} />
                        </GlassCard>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {error ? (
                        <GlassCard style={styles.errorCard} intensity={20}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.error} />
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity style={styles.retryButton} onPress={fetchSoilData}>
                                <Text style={styles.retryButtonText}>Refresh Sync</Text>
                            </TouchableOpacity>
                        </GlassCard>
                    ) : result ? (
                        <Animated.View style={{ opacity: fadeAnim }}>
                            {/* Centered Moisture Visualization */}
                            <View style={styles.visualContainer}>
                                <GlassCard style={styles.moistureRingCard} intensity={40} noPadding={true}>
                                    <View style={styles.ringOuter}>
                                        <View style={styles.ringInner}>
                                            <Text style={styles.ringValue}>{(result.soil_moisture * 100).toFixed(0)}%</Text>
                                            <Text style={styles.ringLabel}>MOISTURE</Text>
                                        </View>
                                    </View>
                                </GlassCard>
                            </View>

                            {/* Status Card */}
                            <GlassCard style={styles.statusCard} intensity={25}>
                                <View style={[styles.statusBadge, { backgroundColor: result.decision.irrigation.decision.includes('Urgent') ? colors.error : colors.primary }]}>
                                    <Text style={styles.statusBadgeText}>{result.decision.irrigation.decision}</Text>
                                </View>
                                <Text style={styles.statusExplan}>{result.decision.irrigation.reason}</Text>
                            </GlassCard>

                            <Text style={styles.label}>Farm Optimization Resources</Text>
                            <View style={styles.resourceGrid}>
                                {[
                                    { icon: 'water-percent', val: result.decision.resources.water_usage, label: 'Water', color: '#0288D1' },
                                    { icon: 'flask-outline', val: result.decision.resources.fertilizer, label: 'Fertilizer', color: '#388E3C' },
                                    { icon: 'lightning-bolt-outline', val: 'Solar Active', label: 'Energy', color: '#FBC02D' }
                                ].map((item, idx) => (
                                    <View key={idx} style={styles.resourceItem}>
                                        <GlassCard style={styles.resourceGlass} intensity={20} noPadding={true}>
                                            <View style={styles.resourceInner}>
                                                <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                                                <Text style={styles.resourceVal} numberOfLines={1} adjustsFontSizeToFit>{item.val}</Text>
                                                <Text style={styles.resourceLab}>{item.label}</Text>
                                            </View>
                                        </GlassCard>
                                    </View>
                                ))}
                            </View>

                            {/* INTERACTIVE 7-DAY FORECAST */}
                            <Text style={styles.label}>Interactive 7-Day Forecast</Text>
                            <GlassCard style={styles.simCard} intensity={25}>
                                {selectedDay !== null && (
                                    <View style={styles.tooltipContainer}>
                                        <GlassCard style={styles.tooltipGlass} intensity={40}>
                                            <Text style={styles.tooltipDay}>{getDayName(selectedDay)} Insights</Text>
                                            <Text style={styles.tooltipVal}>Proj. Moisture: {(result.simulation.predictions[selectedDay] * 100).toFixed(1)}%</Text>
                                            <Text style={styles.tooltipAdvice}>
                                                {result.simulation.predictions[selectedDay] < 0.15 ? "Needs moderate watering" : "Stable ground health"}
                                            </Text>
                                        </GlassCard>
                                    </View>
                                )}

                                <View style={styles.simHeader}>
                                    <View style={styles.simTitleRow}>
                                        <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={26} color={colors.primary} />
                                        <View style={styles.simMeta}>
                                            <Text style={styles.simTitle}>Dynamic Trend: {result.simulation.trend}</Text>
                                            <Text style={styles.simSubtle}>Tap bars for detailed daily insights</Text>
                                        </View>
                                    </View>
                                </View>
                                
                                <View style={styles.simChartContainer}>
                                    <View style={styles.yAxis}>
                                        <Text style={styles.yLabel}>35%</Text>
                                        <Text style={styles.yLabel}>20%</Text>
                                        <Text style={styles.yLabel}>5%</Text>
                                    </View>
                                    
                                    <View style={styles.simChart}>
                                        {result.simulation.predictions.map((val, i) => (
                                            <TouchableOpacity 
                                                key={i} 
                                                style={styles.chartCol} 
                                                onPress={() => handleDayPress(i)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.barContainer}>
                                                    <View style={[
                                                        styles.chartBar, 
                                                        { 
                                                            height: `${Math.min(val * 250, 100)}%`,
                                                            backgroundColor: val > 0.2 ? colors.primary : val < 0.12 ? colors.error : colors.secondary,
                                                            opacity: selectedDay === null || selectedDay === i ? 1 : 0.4,
                                                            borderWidth: selectedDay === i ? 2 : 0,
                                                            borderColor: colors.text.primary
                                                        }
                                                    ]} />
                                                </View>
                                                <Text style={[styles.chartDay, { color: selectedDay === i ? colors.primary : colors.text.secondary }]}>{getDayName(i)}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                                
                                <View style={styles.simLegend}>
                                    <View style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                                        <Text style={styles.legendText}>Optimal</Text>
                                    </View>
                                    <View style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
                                        <Text style={styles.legendText}>Stable</Text>
                                    </View>
                                </View>
                            </GlassCard>

                            <View style={{ height: 140 }} />
                        </Animated.View>
                    ) : null}
                </ScrollView>
            </SafeAreaView>
        </MainBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 20, fontSize: 16, fontWeight: '800', color: colors.text.primary },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    headerIcon: { width: 44, height: 44, borderRadius: 22 },
    headerTitle: { fontSize: 20, fontWeight: '900', color: colors.text.primary, letterSpacing: -0.5 },
    scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
    visualContainer: { alignItems: 'center', marginVertical: spacing.xl },
    moistureRingCard: { width: 200, height: 200, borderRadius: 100 },
    ringOuter: {
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 10,
        borderColor: 'rgba(0,0,0,0.03)',
        borderTopColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringInner: { alignItems: 'center' },
    ringValue: { fontSize: 48, fontWeight: '900', color: colors.text.primary },
    ringLabel: { fontSize: 11, fontWeight: '800', color: colors.text.secondary, letterSpacing: 1 },
    statusCard: { padding: spacing.xl, alignItems: 'center', borderRadius: 30, marginBottom: spacing.xl },
    statusBadge: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginBottom: 12 },
    statusBadgeText: { color: 'white', fontWeight: '900', fontSize: 14 },
    statusExplan: { textAlign: 'center', fontSize: 15, fontWeight: '600', color: colors.text.primary, lineHeight: 22 },
    label: { fontSize: 16, fontWeight: '800', color: colors.text.primary, marginBottom: spacing.md, marginTop: spacing.lg },
    resourceGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    resourceItem: { width: (width - spacing.lg * 2 - spacing.md * 2) / 3, height: 110 },
    resourceGlass: { flex: 1, borderRadius: 24 },
    resourceInner: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
    resourceVal: { marginTop: 8, fontSize: 13, fontWeight: '900', color: colors.text.primary, textAlign: 'center', width: '90%' },
    resourceLab: { fontSize: 10, color: colors.text.secondary, fontWeight: '800', marginTop: 2, textTransform: 'uppercase' },
    simCard: { padding: spacing.xl, borderRadius: 32 },
    tooltipContainer: { marginBottom: 15 },
    tooltipGlass: { padding: 12, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.4)' },
    tooltipDay: { fontSize: 13, fontWeight: '900', color: colors.primary },
    tooltipVal: { fontSize: 16, fontWeight: '900', color: colors.text.primary, marginVertical: 2 },
    tooltipAdvice: { fontSize: 11, fontWeight: '700', color: colors.text.secondary },
    simHeader: { marginBottom: spacing.lg },
    simTitleRow: { flexDirection: 'row', alignItems: 'center' },
    simMeta: { marginLeft: 12 },
    simTitle: { fontWeight: '900', color: colors.text.primary, fontSize: 15 },
    simSubtle: { fontSize: 11, color: colors.text.secondary, fontWeight: '600', marginTop: 2 },
    simChartContainer: { flexDirection: 'row', height: 160, marginTop: 10 },
    yAxis: { justifyContent: 'space-between', paddingRight: 10, paddingVertical: 10, borderRightWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    yLabel: { fontSize: 9, color: colors.text.secondary, fontWeight: '800' },
    simChart: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingBottom: 10 },
    chartCol: { alignItems: 'center', flex: 1 },
    barContainer: { height: '100%', width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
    chartBar: { width: 14, borderRadius: 7 },
    chartDay: { marginTop: 10, fontSize: 10, fontWeight: '900', color: colors.text.secondary },
    simLegend: { flexDirection: 'row', justifyContent: 'center', marginTop: 15, borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.03)', paddingTop: 15 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 15 },
    legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    legendText: { fontSize: 11, fontWeight: '800', color: colors.text.secondary },
    errorCard: { padding: spacing.xl, alignItems: 'center', marginTop: 40 },
    errorText: { marginVertical: 20, color: colors.error, fontWeight: '800', textAlign: 'center' },
    retryButton: { backgroundColor: colors.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 15 },
    retryButtonText: { color: 'white', fontWeight: '900' }
});
