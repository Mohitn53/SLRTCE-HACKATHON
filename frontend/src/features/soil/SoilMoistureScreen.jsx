import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import * as Location from 'expo-location';
import { colors, spacing, typography } from '../../core/theme';
import agricultureService from '../../services/agricultureService';
import { useLanguage } from '../../store/languageStore';

export default function SoilMoistureScreen() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSoilData();
    }, []);

    const fetchSoilData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Get Location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let userLocation = await Location.getCurrentPositionAsync({});
            setLocation(userLocation.coords);

            // 2. Fetch Data from Analytics Engine
            // Using a default soil moisture value for simulation if not provided by hardware
            const mockMoisture = 0.18; 
            
            const data = await agricultureService.getLocationDecision(
                userLocation.coords.latitude,
                userLocation.coords.longitude,
                mockMoisture
            );

            if (data.status === 'success') {
                setResult(data.result);
            } else {
                setError('Failed to get agricultural decision');
            }
        } catch (err) {
            console.error(err);
            setError('Error connecting to agriculture service');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (decision) => {
        if (decision.includes('Urgent')) return colors.light.error;
        if (decision.includes('Light')) return colors.light.accent;
        return colors.light.success;
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.light.primary} />
                <Text style={styles.loadingText}>Analyzing Soil Data...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Soil Analytics</Text>
                <TouchableOpacity onPress={fetchSoilData} style={styles.refreshButton}>
                    <Text style={styles.refreshIcon}>🔄</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {error ? (
                    <View style={styles.errorCard}>
                        <Text style={styles.errorText}>❌ {error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchSoilData}>
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : result ? (
                    <>
                        {/* Summary Card */}
                        <View style={styles.summaryCard}>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(result.decision.irrigation.decision) }]}>
                                <Text style={styles.statusText}>{result.decision.irrigation.decision}</Text>
                            </View>
                            <Text style={styles.moistureLabel}>Current Soil Moisture</Text>
                            <Text style={styles.moistureValue}>{(result.soil_moisture * 100).toFixed(1)}%</Text>
                            <Text style={styles.recommendationText}>{result.decision.irrigation.reason}</Text>
                        </View>

                        {/* Weather Impact */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>🌤️ Weather Forecast Impact</Text>
                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Expected Rain</Text>
                                    <Text style={styles.statValue}>{result.weather.rainfall_24h}mm</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Cloud Cover</Text>
                                    <Text style={styles.statValue}>{result.weather.cloud_cover}%</Text>
                                </View>
                            </View>
                        </View>

                        {/* Resource Recommendations */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>🌱 Resource Optimization</Text>
                            <View style={styles.resourceItem}>
                                <Text style={styles.resourceIcon}>💧</Text>
                                <View>
                                    <Text style={styles.resourceLabel}>Water Requirement</Text>
                                    <Text style={styles.resourceValue}>{result.decision.resources.water_usage}</Text>
                                </View>
                            </View>
                            <View style={styles.resourceItem}>
                                <Text style={styles.resourceIcon}>🧪</Text>
                                <View>
                                    <Text style={styles.resourceLabel}>Fertilizer Advice</Text>
                                    <Text style={styles.resourceValue}>{result.decision.resources.fertilizer}</Text>
                                </View>
                            </View>
                            <View style={styles.resourceItem}>
                                <Text style={styles.resourceIcon}>⚡</Text>
                                <View>
                                    <Text style={styles.resourceLabel}>Energy Optimization</Text>
                                    <Text style={styles.resourceValue}>{result.decision.resources.energy_optimization}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Future Simulation */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>🔮 3-Day Forecast</Text>
                            <Text style={styles.trendText}>Tendency: {result.simulation.trend}</Text>
                            <View style={styles.forecastRow}>
                                {result.simulation.predictions.map((val, idx) => (
                                    <View key={idx} style={styles.forecastItem}>
                                        <Text style={styles.dayText}>Day {idx + 1}</Text>
                                        <Text style={styles.forecastValue}>{(val * 100).toFixed(0)}%</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <Text style={styles.confidenceText}>
                            Analysis Confidence: {(result.decision.irrigation.confidence * 100).toFixed(0)}%
                        </Text>
                    </>
                ) : (
                    <Text style={styles.loadingText}>No data available</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.light.background,
    },
    header: {
        padding: spacing.l,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        ...typography.header,
        color: colors.light.text,
    },
    refreshButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.light.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.light.border,
    },
    refreshIcon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.l,
    },
    loadingText: {
        marginTop: spacing.m,
        color: colors.light.textSecondary,
        ...typography.body,
    },
    summaryCard: {
        backgroundColor: colors.light.surface,
        borderRadius: 24,
        padding: spacing.xl,
        alignItems: 'center',
        marginBottom: spacing.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    statusBadge: {
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.s,
        borderRadius: 20,
        marginBottom: spacing.l,
    },
    statusText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
        textTransform: 'uppercase',
    },
    moistureLabel: {
        ...typography.caption,
        color: colors.light.textSecondary,
        marginBottom: spacing.xs,
    },
    moistureValue: {
        fontSize: 48,
        fontWeight: '800',
        color: colors.light.primary,
        marginBottom: spacing.m,
    },
    recommendationText: {
        textAlign: 'center',
        ...typography.body,
        color: colors.light.text,
        lineHeight: 24,
    },
    card: {
        backgroundColor: colors.light.surface,
        borderRadius: 20,
        padding: spacing.l,
        marginBottom: spacing.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.light.text,
        marginBottom: spacing.m,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: colors.light.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.light.text,
    },
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    resourceIcon: {
        fontSize: 24,
        marginRight: spacing.m,
        width: 40,
        textAlign: 'center',
    },
    resourceLabel: {
        fontSize: 12,
        color: colors.light.textSecondary,
    },
    resourceValue: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.light.text,
    },
    trendText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.light.primary,
        marginBottom: spacing.m,
    },
    forecastRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    forecastItem: {
        alignItems: 'center',
        flex: 1,
    },
    dayText: {
        fontSize: 12,
        color: colors.light.textSecondary,
        marginBottom: 4,
    },
    forecastValue: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.light.text,
    },
    confidenceText: {
        textAlign: 'center',
        fontSize: 12,
        color: colors.light.textSecondary,
        marginVertical: spacing.xl,
        fontStyle: 'italic',
    },
    errorCard: {
        padding: spacing.xl,
        backgroundColor: '#FEE2E2',
        borderRadius: 16,
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    errorText: {
        color: '#991B1B',
        textAlign: 'center',
        marginBottom: spacing.l,
    },
    retryButton: {
        backgroundColor: '#991B1B',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.s,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
    }
});
