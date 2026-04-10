import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../../core/theme';
import agricultureService from '../../services/agricultureService';
import { useLanguage } from '../../store/languageStore';

const { width } = Dimensions.get('window');

export default function SoilMoistureScreen() {
    const navigation = useNavigation();
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
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let userLocation = await Location.getCurrentPositionAsync({});
            setLocation(userLocation.coords);

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
        if (!decision) return colors.light.primary;
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
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={28} color={colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Soil Analytics</Text>
                <TouchableOpacity onPress={fetchSoilData} style={styles.refreshButton}>
                    <Ionicons name="refresh" size={22} color={colors.light.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {error ? (
                    <View style={styles.errorCard}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#991B1B" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchSoilData}>
                            <Text style={styles.retryButtonText}>Retry Analysis</Text>
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
                            <View style={styles.moistureValueContainer}>
                                <Text style={styles.moistureValue}>{(result.soil_moisture * 100).toFixed(1)}</Text>
                                <Text style={styles.moisturePercent}>%</Text>
                            </View>
                            <Text style={styles.recommendationText}>{result.decision.irrigation.reason}</Text>
                        </View>

                        {/* Weather Impact */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons name="weather-cloudy" size={24} color={colors.light.primary} />
                                <Text style={styles.cardTitle}>Weather Forecast Impact</Text>
                            </View>
                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Expected Rain</Text>
                                    <Text style={styles.statValue}>{result.weather.rainfall_24h}mm</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Cloud Cover</Text>
                                    <View style={styles.cloudRow}>
                                        <Text style={styles.statValue}>{result.weather.cloud_cover}</Text>
                                        <Text style={styles.statUnit}>%</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Resource Recommendations */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons name="leaf" size={24} color={colors.light.primary} />
                                <Text style={styles.cardTitle}>Resource Optimization</Text>
                            </View>
                            <View style={styles.resourceItem}>
                                <View style={styles.resourceIconBg}>
                                    <Ionicons name="water" size={20} color={colors.light.primary} />
                                </View>
                                <View style={styles.resourceTextContent}>
                                    <Text style={styles.resourceLabel}>Water Requirement</Text>
                                    <Text style={styles.resourceValue}>{result.decision.resources.water_usage}</Text>
                                </View>
                            </View>
                            <View style={styles.resourceItem}>
                                <View style={styles.resourceIconBg}>
                                    <MaterialCommunityIcons name="flask" size={20} color={colors.light.primary} />
                                </View>
                                <View style={styles.resourceTextContent}>
                                    <Text style={styles.resourceLabel}>Fertilizer Advice</Text>
                                    <Text style={styles.resourceValue}>{result.decision.resources.fertilizer}</Text>
                                </View>
                            </View>
                            <View style={styles.resourceItem}>
                                <View style={styles.resourceIconBg}>
                                    <Ionicons name="bolt" size={20} color={colors.light.primary} />
                                </View>
                                <View style={styles.resourceTextContent}>
                                    <Text style={styles.resourceLabel}>Energy Optimization</Text>
                                    <Text style={styles.resourceValue}>{result.decision.resources.energy_optimization}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Future Simulation */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons name="crystal-ball" size={24} color={colors.light.primary} />
                                <Text style={styles.cardTitle}>3-Day Forecast Simulation</Text>
                            </View>
                            <View style={styles.trendContainer}>
                                <Ionicons 
                                    name={result.simulation.trend === 'Increasing' ? 'trending-up' : 'trending-down'} 
                                    size={16} 
                                    color={result.simulation.trend === 'Increasing' ? colors.light.success : colors.light.error} 
                                />
                                <Text style={[
                                    styles.trendText,
                                    { color: result.simulation.trend === 'Increasing' ? colors.light.success : colors.light.error }
                                ]}>
                                    Tendency: {result.simulation.trend}
                                </Text>
                            </View>
                            <View style={styles.forecastRow}>
                                {result.simulation.predictions.map((val, idx) => (
                                    <View key={idx} style={styles.forecastItem}>
                                        <Text style={styles.dayText}>Day {idx + 1}</Text>
                                        <Text style={styles.forecastValue}>{(val * 100).toFixed(0)}%</Text>
                                        <View style={[styles.forecastBar, { height: Math.max(10, val * 50) }]} />
                                    </View>
                                ))}
                            </View>
                        </View>

                        <Text style={styles.confidenceText}>
                            Analysis Confidence: {(result.decision.irrigation.confidence * 100).toFixed(0)}% • Model SMAP v4.2
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
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.light.background,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    title: {
        ...typography.header,
        fontSize: 22,
        color: colors.light.text,
        flex: 1,
        textAlign: 'center',
    },
    refreshButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: 32,
        padding: spacing.xl,
        alignItems: 'center',
        marginBottom: spacing.l,
        marginTop: spacing.s,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    statusBadge: {
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.s,
        borderRadius: 20,
        marginBottom: spacing.l,
    },
    statusText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    moistureLabel: {
        ...typography.caption,
        color: colors.light.textSecondary,
        fontSize: 14,
        marginBottom: 4,
    },
    moistureValueContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: spacing.m,
    },
    moistureValue: {
        fontSize: 64,
        fontWeight: '900',
        color: colors.light.primary,
    },
    moisturePercent: {
        fontSize: 24,
        color: colors.light.primary,
        marginBottom: 12,
        marginLeft: 2,
        fontWeight: '600',
    },
    recommendationText: {
        textAlign: 'center',
        ...typography.body,
        color: colors.light.text,
        lineHeight: 22,
        fontWeight: '500',
    },
    card: {
        backgroundColor: colors.light.surface,
        borderRadius: 24,
        padding: spacing.l,
        marginBottom: spacing.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.light.text,
        marginLeft: spacing.m,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: colors.light.border,
    },
    statLabel: {
        fontSize: 12,
        color: colors.light.textSecondary,
        marginBottom: 6,
        fontWeight: '600',
    },
    cloudRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.light.text,
    },
    statUnit: {
        fontSize: 14,
        color: colors.light.text,
        marginBottom: 3,
        marginLeft: 1,
        fontWeight: '600',
    },
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    resourceIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    resourceTextContent: {
        flex: 1,
    },
    resourceLabel: {
        fontSize: 12,
        color: colors.light.textSecondary,
        fontWeight: '500',
        marginBottom: 2,
    },
    resourceValue: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.light.text,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.l,
        backgroundColor: 'rgba(0,0,0,0.03)',
        paddingHorizontal: spacing.m,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    trendText: {
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 6,
    },
    forecastRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: spacing.s,
    },
    forecastItem: {
        alignItems: 'center',
        flex: 1,
    },
    dayText: {
        fontSize: 12,
        color: colors.light.textSecondary,
        fontWeight: '600',
        marginBottom: 8,
    },
    forecastValue: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.light.text,
        marginBottom: 8,
    },
    forecastBar: {
        width: 30,
        borderRadius: 6,
        backgroundColor: colors.light.primary,
        opacity: 0.6,
    },
    confidenceText: {
        textAlign: 'center',
        fontSize: 11,
        color: colors.light.textSecondary,
        marginVertical: spacing.xl,
        letterSpacing: 0.5,
    },
    errorCard: {
        padding: spacing.xl,
        backgroundColor: '#FEF2F2',
        borderRadius: 24,
        alignItems: 'center',
        marginTop: spacing.xxl,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    errorText: {
        color: '#991B1B',
        textAlign: 'center',
        marginVertical: spacing.l,
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: '#991B1B',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.m,
        borderRadius: 12,
        shadowColor: '#991B1B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    }
});
