import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView, Linking, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../core/theme';
import { useAuth } from '../../store/authStore';
import { useLanguage } from '../../store/languageStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const { t, language } = useLanguage();

    const [location, setLocation] = useState(null);
    const [nearbyDepartments, setNearbyDepartments] = useState([]);
    const [locationPermission, setLocationPermission] = useState(false);
    const [weatherAlert, setWeatherAlert] = useState(null);
    const [recommendedCrops, setRecommendedCrops] = useState([]);
    const [currentSeason, setCurrentSeason] = useState('');

    const getLocalizedDate = () => {
        const date = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };

        if (language === 'hi') {
            return date.toLocaleDateString('hi-IN', options);
        } else if (language === 'mr') {
            return date.toLocaleDateString('mr-IN', options);
        }
        return date.toLocaleDateString('en-US', options);
    };

    const sampleDepartments = [
        { id: 1, name: 'District Agriculture Office', lat: 19.0760, lng: 72.8777, distance: 2.5 },
        { id: 2, name: 'Krishi Vigyan Kendra', lat: 19.0896, lng: 72.8656, distance: 4.2 },
        { id: 3, name: 'Agricultural Extension Center', lat: 19.0545, lng: 72.8910, distance: 5.8 },
    ];

    const cropDatabase = {
        'Kharif': [
            { name: 'Rice', icon: '🌾', profitability: 'High', duration: '120-150 days' },
            { name: 'Cotton', icon: '🌸', profitability: 'High', duration: '150-180 days' },
            { name: 'Soybean', icon: '🫘', profitability: 'Medium', duration: '90-120 days' },
        ],
        'Rabi': [
            { name: 'Wheat', icon: '🌾', profitability: 'High', duration: '120-150 days' },
            { name: 'Mustard', icon: '🌼', profitability: 'Medium', duration: '90-120 days' },
            { name: 'Chickpea', icon: '🫘', profitability: 'High', duration: '100-120 days' },
        ],
        'Zaid': [
            { name: 'Watermelon', icon: '🍉', profitability: 'High', duration: '80-100 days' },
            { name: 'Cucumber', icon: '🥒', profitability: 'Medium', duration: '50-70 days' },
            { name: 'Muskmelon', icon: '🍈', profitability: 'Medium', duration: '80-100 days' },
        ],
    };

    useEffect(() => {
        requestLocationPermission();
        determineSeasonAndCrops();
    }, []);

    const determineSeasonAndCrops = () => {
        const month = new Date().getMonth() + 1;
        let season = '';

        if (month >= 6 && month <= 10) {
            season = 'Kharif';
        } else if (month >= 11 || month <= 3) {
            season = 'Rabi';
        } else {
            season = 'Zaid';
        }

        setCurrentSeason(season);
        setRecommendedCrops(cropDatabase[season] || []);
    };

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setLocationPermission(true);
                getUserLocation();
            }
        } catch (error) {
            console.log('Location permission error:', error);
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return parseFloat(d.toFixed(1));
    };

    const getUserLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setLocation(location.coords);

            const updatedDepartments = sampleDepartments.map(dept => ({
                ...dept,
                distance: calculateDistance(latitude, longitude, dept.lat, dept.lng)
            })).sort((a, b) => a.distance - b.distance);

            setNearbyDepartments(updatedDepartments);
            checkWeatherAlerts(location.coords);
        } catch (error) {
            console.log('Get location error:', error);
        }
    };

    const checkWeatherAlerts = (coords) => {
        setWeatherAlert({
            type: 'safe',
            message: t('home.noAlerts')
        });
    };

    const openDirections = (dept) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${dept.lat},${dept.lng}`;
        Linking.openURL(url);
    };

    const handleLogout = () => {
        Alert.alert(t('home.logout'), t('home.logoutConfirm'), [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('home.logout'), style: 'destructive', onPress: logout }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>{t('home.greeting')}, {user?.username || 'Farmer'}</Text>
                    <Text style={styles.date}>{getLocalizedDate()}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={colors.light.error} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Weather Alert Banner */}
                    {weatherAlert && (
                        <View style={[
                            styles.alertBanner,
                            weatherAlert.type === 'safe' ? styles.alertSafe : styles.alertDanger
                        ]}>
                            <View style={styles.alertIconBg}>
                                <MaterialCommunityIcons 
                                    name={weatherAlert.type === 'safe' ? "weather-sunny" : "alert-outline"} 
                                    size={24} 
                                    color={weatherAlert.type === 'safe' ? '#4caf50' : '#f44336'} 
                                />
                            </View>
                            <View style={styles.alertTextContainer}>
                                <Text style={styles.alertTitle}>{t('home.weatherAlert')}</Text>
                                <Text style={styles.alertMessage}>{weatherAlert.message}</Text>
                            </View>
                        </View>
                    )}

                    {/* Main Action - Scan */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => navigation.navigate('Camera')}
                            activeOpacity={0.9}
                        >
                            <View style={styles.iconCircle}>
                                <MaterialCommunityIcons name="camera-iris" size={50} color="white" />
                            </View>
                            <Text style={styles.scanButtonText}>{t('home.scanCrop')}</Text>
                            <Text style={styles.scanButtonSubtext}>{t('home.detectDiseases')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Featured Section: Soil Analytics */}
                    <Text style={styles.sectionTitle}>✨ Featured Analytics</Text>
                    <TouchableOpacity
                        style={styles.soilCard}
                        onPress={() => navigation.navigate('SoilMoisture')}
                    >
                        <View style={styles.soilCardLeft}>
                            <View style={styles.soilIconBg}>
                                <MaterialCommunityIcons name="molecule" size={32} color="white" />
                            </View>
                        </View>
                        <View style={styles.soilCardRight}>
                            <Text style={styles.soilTitle}>{t('home.soilAnalytics')}</Text>
                            <Text style={styles.soilSubtitle}>{t('home.soilStatus')}</Text>
                            <View style={styles.soilTag}>
                                <Text style={styles.soilTagText}>AI Powered v4.2</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.light.textSecondary} />
                    </TouchableOpacity>

                    {/* Grid Actions */}
                    <View style={styles.grid}>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('History')}
                        >
                            <View style={styles.cardIconBg}>
                                <MaterialCommunityIcons name="history" size={24} color={colors.light.primary} />
                            </View>
                            <Text style={styles.cardTitle}>{t('home.history')}</Text>
                            <Text style={styles.cardSubtitle}>{t('home.pastScans')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('Settings')}
                        >
                            <View style={styles.cardIconBgSecondary}>
                                <MaterialCommunityIcons name="cog-outline" size={24} color="#6366f1" />
                            </View>
                            <Text style={styles.cardTitle}>{t('home.settings')}</Text>
                            <Text style={styles.cardSubtitle}>{t('home.preferences')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Recommended Crops Section */}
                    <View style={styles.cropsSection}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>🌱 {t('home.profitableCrops')}</Text>
                        </View>
                        <Text style={styles.sectionSubtitle}>
                            {t('home.basedOnLocation')} • {t('home.season')}: {currentSeason}
                        </Text>

                        {recommendedCrops.map((crop, index) => (
                            <View key={index} style={styles.cropCard}>
                                <View style={styles.cropIconBg}>
                                    <Text style={styles.cropIconEmoji}>{crop.icon}</Text>
                                </View>
                                <View style={styles.cropDetails}>
                                    <Text style={styles.cropName}>{crop.name}</Text>
                                    <Text style={styles.cropDuration}>⏱️ {crop.duration}</Text>
                                </View>
                                <View style={[
                                    styles.profitBadge,
                                    crop.profitability === 'High' ? styles.profitHigh : styles.profitMedium
                                ]}>
                                    <Text style={styles.profitText}>{crop.profitability}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Nearby Agricultural Departments */}
                    <View style={styles.departmentsSection}>
                        <Text style={styles.sectionTitle}>📍 {t('home.nearbyDepartments')}</Text>

                        {!locationPermission ? (
                            <View style={styles.permissionCard}>
                                <MaterialIcons name="location-off" size={48} color={colors.light.textSecondary} />
                                <Text style={styles.permissionText}>{t('home.locationPermission')}</Text>
                                <TouchableOpacity
                                    style={styles.permissionButton}
                                    onPress={requestLocationPermission}
                                >
                                    <Text style={styles.permissionButtonText}>Enable Location</Text>
                                </TouchableOpacity>
                            </View>
                        ) : nearbyDepartments.length > 0 ? (
                            nearbyDepartments.map((dept) => (
                                <View key={dept.id} style={styles.departmentCard}>
                                    <View style={styles.departmentInfo}>
                                        <View style={styles.deptIconBg}>
                                            <MaterialCommunityIcons name="office-building" size={24} color={colors.light.primary} />
                                        </View>
                                        <View style={styles.departmentDetails}>
                                            <Text style={styles.departmentName}>{dept.name}</Text>
                                            <Text style={styles.departmentDistance}>
                                                📏 {dept.distance} {t('home.distance')}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.directionsButton}
                                        onPress={() => openDirections(dept)}
                                    >
                                        <MaterialCommunityIcons name="directions" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={styles.noDepartmentsCard}>
                                <Text style={styles.noDepartmentsText}>{t('home.noNearbyDepartments')}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    header: {
        padding: spacing.l,
        paddingTop: spacing.l,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        ...typography.header,
        color: colors.light.text,
        fontSize: 24,
    },
    date: {
        ...typography.caption,
        fontSize: 14,
        color: colors.light.textSecondary,
        marginTop: 2,
    },
    logoutButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fee2e2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: spacing.l,
    },
    alertBanner: {
        flexDirection: 'row',
        padding: spacing.m,
        borderRadius: 16,
        marginBottom: spacing.l,
        alignItems: 'center',
        backgroundColor: colors.light.surface,
        borderWidth: 1,
        borderColor: colors.light.border,
    },
    alertIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    alertTextContainer: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.light.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    alertMessage: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.light.text,
    },
    actionContainer: {
        marginBottom: spacing.xl,
    },
    scanButton: {
        width: '100%',
        backgroundColor: colors.light.primary,
        borderRadius: 28,
        paddingVertical: spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.light.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 12,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    scanButtonText: {
        ...typography.header,
        color: 'white',
        fontSize: 22,
    },
    scanButtonSubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.light.text,
        marginBottom: spacing.m,
    },
    soilCard: {
        flexDirection: 'row',
        backgroundColor: colors.light.surface,
        borderRadius: 24,
        padding: spacing.m,
        alignItems: 'center',
        marginBottom: spacing.l,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.light.border,
    },
    soilIconBg: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    soilCardRight: {
        flex: 1,
    },
    soilTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.light.text,
    },
    soilSubtitle: {
        fontSize: 13,
        color: colors.light.textSecondary,
        marginVertical: 2,
    },
    soilTag: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    soilTagText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.light.primary,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    card: {
        width: (width - spacing.l * 2 - spacing.m) / 2,
        backgroundColor: colors.light.surface,
        borderRadius: 24,
        padding: spacing.m,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.light.border,
    },
    cardIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    cardIconBgSecondary: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.light.text,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 11,
        color: colors.light.textSecondary,
        fontWeight: '500',
    },
    cropsSection: {
        marginTop: spacing.s,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: colors.light.textSecondary,
        marginBottom: spacing.m,
        fontWeight: '500',
    },
    cropCard: {
        backgroundColor: colors.light.surface,
        borderRadius: 18,
        padding: spacing.m,
        marginBottom: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    cropIconBg: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: colors.light.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    cropIconEmoji: {
        fontSize: 28,
    },
    cropDetails: {
        flex: 1,
    },
    cropName: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.light.text,
    },
    cropDuration: {
        fontSize: 12,
        color: colors.light.textSecondary,
        marginTop: 2,
    },
    profitBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    profitHigh: {
        backgroundColor: '#4caf50',
    },
    profitMedium: {
        backgroundColor: '#ff9800',
    },
    profitText: {
        fontSize: 11,
        fontWeight: '800',
        color: 'white',
        textTransform: 'uppercase',
    },
    departmentsSection: {
        marginTop: spacing.l,
        paddingBottom: spacing.xxl,
    },
    permissionCard: {
        backgroundColor: colors.light.surface,
        borderRadius: 20,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.light.border,
        borderStyle: 'dashed',
    },
    permissionText: {
        fontSize: 14,
        color: colors.light.textSecondary,
        textAlign: 'center',
        marginVertical: spacing.m,
        fontWeight: '500',
    },
    permissionButton: {
        backgroundColor: colors.light.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.s,
        borderRadius: 12,
    },
    permissionButtonText: {
        color: 'white',
        fontWeight: '700',
    },
    departmentCard: {
        backgroundColor: colors.light.surface,
        borderRadius: 20,
        padding: spacing.m,
        marginBottom: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    departmentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    deptIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    departmentName: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.light.text,
    },
    departmentDistance: {
        fontSize: 12,
        color: colors.light.textSecondary,
        marginTop: 2,
    },
    directionsButton: {
        backgroundColor: colors.light.primary,
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
