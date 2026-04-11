import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Dimensions, Platform, Alert, Linking, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../core/theme';
import { useAuth } from '../../store/authStore';
import { useLanguage } from '../../store/languageStore';
import { MainBackground } from '../../components/MainBackground';
import { GlassCard } from '../../components/GlassCard';

const { width } = Dimensions.get('window');
const CAROUSEL_WIDTH = width - spacing.lg * 2;

const APP_FEATURES = [
    {
        title: "AI Crop Health",
        desc: "Instant disease detection using high-precision satellite & camera neural networks.",
        icon: "shield-bug",
        color: colors.primary
    },
    {
        title: "Soil Intelligence",
        desc: "Monitor soil moisture & nutrient levels to optimize your irrigation cycles.",
        icon: "sprout",
        color: "#0288D1"
    },
    {
        title: "Kisan AI Expert",
        desc: "Get 24/7 agricultural guidance in your local language from our expert chatbot.",
        icon: "robot-confused",
        color: colors.secondary
    },
    {
        title: "Agri Community",
        desc: "Connect with regional farmers to share best practices and market prices.",
        icon: "account-group",
        color: "#6D4C41"
    }
];

const getDynamicDepartments = (coords) => {
    if (!coords) return [];
    return [
        { id: '1', name: 'Krishi Vigyan Kendra', type: 'Research Center', distance: '4.2 km', lat: coords.latitude + 0.012, lon: coords.longitude + 0.015 },
        { id: '2', name: 'District Agri HQ', type: 'Government Office', distance: '8.5 km', lat: coords.latitude - 0.021, lon: coords.longitude + 0.011 },
        { id: '3', name: 'Soil Testing Lab', type: 'Specialized Lab', distance: '12.1 km', lat: coords.latitude + 0.035, lon: coords.longitude - 0.012 },
        { id: '4', name: 'Seed Distribution Hub', type: 'Govt. Warehouse', distance: '15.4 km', lat: coords.latitude - 0.005, lon: coords.longitude + 0.042 },
    ];
};

const MOCK_RECOMMENDATIONS = [
    { id: '1', crop: 'Wheat', yield: 'High', icon: 'barley' },
    { id: '2', crop: 'Mustard', yield: 'Steady', icon: 'flower-tulip' },
    { id: '3', crop: 'Rice (Basmati)', yield: 'Premium', icon: 'clover' },
    { id: '4', crop: 'Maize', yield: 'Resilient', icon: 'corn' },
    { id: '5', crop: 'Pearl Millet', yield: 'High', icon: 'sprout-outline' },
];

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [location, setLocation] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);
    const autoScrollTimer = useRef(null);

    useEffect(() => {
        requestLocation();
        startAutoScroll();
        return () => stopAutoScroll();
    }, []);

    const requestLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let loc = await Location.getCurrentPositionAsync({});
                setLocation(loc.coords);
                setDepartments(getDynamicDepartments(loc.coords));
            }
        } catch (e) {
            console.log('Location error:', e);
        }
    };

    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollTimer.current = setInterval(() => {
            setActiveIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % APP_FEATURES.length;
                scrollRef.current?.scrollTo({ x: nextIndex * CAROUSEL_WIDTH, animated: true });
                return nextIndex;
            });
        }, 5000); // Slower, less distracting interval
    };

    const stopAutoScroll = () => {
        if (autoScrollTimer.current) {
            clearInterval(autoScrollTimer.current);
            autoScrollTimer.current = null;
        }
    };

    const onManualScroll = (event) => {
        const xOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(xOffset / CAROUSEL_WIDTH);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('home.morning') || 'Good Morning';
        if (hour < 17) return t('home.afternoon') || 'Good Afternoon';
        return t('home.evening') || 'Good Evening';
    };

    const handleNavigateToDept = (dept) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${dept.name}@${dept.lat},${dept.lon}`,
            android: `geo:0,0?q=${dept.lat},${dept.lon}(${dept.name})`,
        });
        Linking.openURL(url).catch(() => {
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${dept.lat},${dept.lon}`);
        });
    };

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.header}>
                            <View style={styles.greetingSection}>
                                <Text style={styles.greeting}>{getGreeting()},</Text>
                                <Text style={styles.userName}>{user?.username?.split(' ')[0] || 'Farmer'}</Text>
                                <Text style={styles.date}>{new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.profileBtn}>
                                <GlassCard style={styles.profileAvatar} intensity={50} noPadding={true}>
                                    <View style={styles.avatarInner}>
                                        <Text style={styles.avatarInitial}>{user?.username?.charAt(0).toUpperCase() || 'F'}</Text>
                                    </View>
                                </GlassCard>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* FEATURE CAROUSEL */}
                    <View style={styles.sectionContainer}>
                        <GlassCard style={styles.carouselContainer} intensity={30} noPadding={true}>
                            <ScrollView 
                                ref={scrollRef}
                                horizontal 
                                pagingEnabled 
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={onManualScroll}
                                onScrollBeginDrag={stopAutoScroll}
                                onScrollEndDrag={startAutoScroll}
                                scrollEventThrottle={16}
                            >
                                {APP_FEATURES.map((feature, idx) => (
                                    <View key={idx} style={styles.featureSlide}>
                                        <View style={styles.featureLine}>
                                            <MaterialCommunityIcons name={feature.icon} size={28} color={feature.color} />
                                            <Text style={[styles.featureTitle, { color: feature.color }]}>{feature.title}</Text>
                                        </View>
                                        <Text style={styles.featureDesc}>{feature.desc}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                            <View style={styles.paginationRow}>
                                {APP_FEATURES.map((_, i) => (
                                    <View key={i} style={[styles.dot, i === activeIndex && styles.activeDot]} />
                                ))}
                            </View>
                        </GlassCard>
                    </View>

                    {/* Quick Hub Grid */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.actionGrid}>
                            {[
                                { name: 'ScanTab', label: 'Detection', icon: 'camera-iris', color: colors.primary },
                                { name: 'AssistantTab', label: 'AI Helper', icon: 'robot-outline', color: colors.secondary },
                                { name: 'SoilTab', label: 'Soil Hub', icon: 'flask-round-bottom-outline', color: '#039BE5' },
                                { name: 'History', label: 'Logs', icon: 'history', color: '#607D8B' }
                            ].map((item, idx) => (
                                <TouchableOpacity key={idx} style={styles.actionItem} onPress={() => navigation.navigate(item.name)}>
                                    <GlassCard style={styles.actionGlass} intensity={25} noPadding={true}>
                                        <View style={styles.actionCardInner}>
                                            <View style={[styles.actionIconBg, { backgroundColor: item.color + '15' }]}>
                                                <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
                                            </View>
                                            <Text style={styles.actionLabel}>{item.label}</Text>
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Profitable Crops */}
                    <View style={styles.sectionHeaderNoBtn}>
                        <Text style={styles.sectionTitle}>{t('home.profitableCrops') || 'Seasonal Recommendations'}</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                        {MOCK_RECOMMENDATIONS.map((item) => (
                            <GlassCard key={item.id} style={styles.recCard} intensity={25} noPadding={true}>
                                <View style={styles.recCardInner}>
                                    <View style={styles.recIconWrapper}>
                                        <MaterialCommunityIcons name={item.icon} size={36} color={colors.primary} />
                                    </View>
                                    <Text style={styles.recName}>{item.crop}</Text>
                                    <Text style={styles.recYield}>{item.yield} Yield</Text>
                                </View>
                            </GlassCard>
                        ))}
                    </ScrollView>

                    {/* Call to Action */}
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('SeasonalAnalysis')} style={styles.fullWidthBtn}>
                            <GlassCard style={styles.fullWidthGlass} intensity={40} noPadding={true}>
                                <View style={styles.btnContent}>
                                    <Text style={styles.btnText}>OPEN FULL ANALYSIS</Text>
                                    <Ionicons name="sparkles" size={18} color={colors.primary} />
                                </View>
                            </GlassCard>
                        </TouchableOpacity>
                    </View>

                    {/* Nearby Support */}
                    <View style={styles.sectionHeaderNoBtn}>
                        <Text style={styles.sectionTitle}>{t('home.nearbyDepartments') || 'Nearby Support'}</Text>
                    </View>
                    <View style={styles.sectionContainer}>
                        {departments.length > 0 ? departments.map((dept) => (
                            <GlassCard key={dept.id} style={styles.deptCard} intensity={20} noPadding={true}>
                                <View style={styles.deptRow}>
                                    <View style={styles.deptIcon}>
                                        <View style={styles.deptIconInner}><MaterialCommunityIcons name="office-building-marker" size={24} color={colors.secondary} /></View>
                                    </View>
                                    <View style={styles.deptInfo}>
                                        <Text style={styles.deptName}>{dept.name}</Text>
                                        <Text style={styles.deptType}>{dept.type} • {dept.distance}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.deptNavBtn} onPress={() => handleNavigateToDept(dept)}>
                                        <GlassCard style={{ flex: 1, borderRadius: 24 }} intensity={40} noPadding={true}>
                                            <Ionicons name="location" size={20} color={colors.primary} />
                                        </GlassCard>
                                    </TouchableOpacity>
                                </View>
                            </GlassCard>
                        )) : (
                            <View style={styles.locationPlaceholder}><ActivityIndicator color={colors.primary} size="small" /><Text style={styles.locationPlaceholderText}>Locating support...</Text></View>
                        )}
                    </View>

                    <View style={{ height: 140 }} />
                </ScrollView>
            </SafeAreaView>
        </MainBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingVertical: spacing.md },
    sectionContainer: { paddingHorizontal: spacing.lg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xl, paddingTop: spacing.sm },
    greetingSection: { flex: 1 },
    greeting: { fontSize: 16, fontWeight: '700', color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1.5 },
    userName: { fontSize: 34, fontWeight: '900', color: colors.text.primary, letterSpacing: -1, marginTop: -2 },
    date: { fontSize: 13, color: colors.text.secondary, fontWeight: '700', marginTop: 4 },
    profileBtn: { marginTop: 4 },
    profileAvatar: { width: 62, height: 62, borderRadius: 31 },
    avatarInner: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
    avatarInitial: { color: 'white', fontSize: 18, fontWeight: '900' },
    carouselContainer: { height: 160, marginBottom: spacing.xl, borderRadius: 32, overflow: 'hidden' },
    featureSlide: { width: width - spacing.lg * 2, padding: spacing.xl, justifyContent: 'center', height: 160 },
    featureLine: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    featureTitle: { fontSize: 18, fontWeight: '900', marginLeft: 10, letterSpacing: 0.5 },
    featureDesc: { fontSize: 14, color: colors.text.secondary, lineHeight: 20, fontWeight: '600' },
    paginationRow: { position: 'absolute', bottom: 15, right: 25, flexDirection: 'row' },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.1)', marginLeft: 6 },
    activeDot: { backgroundColor: colors.primary, width: 22 },
    actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: spacing.xl },
    actionItem: { width: (width - spacing.lg * 2 - spacing.md) / 2, height: 110, marginBottom: spacing.md },
    actionGlass: { flex: 1, borderRadius: 28 },
    actionCardInner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.md },
    actionIconBg: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
    actionLabel: { fontSize: 13, fontWeight: '800', color: colors.text.primary },
    sectionHeaderNoBtn: { paddingHorizontal: spacing.lg, marginBottom: spacing.md, marginTop: spacing.sm },
    sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.text.primary },
    horizontalScrollContent: { paddingLeft: spacing.lg, paddingRight: spacing.lg, paddingBottom: spacing.lg },
    recCard: { width: 145, height: 180, marginRight: 15, borderRadius: 30 },
    recCardInner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.md },
    recIconWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary + '10', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    recName: { fontSize: 18, fontWeight: '900', color: colors.text.primary },
    recYield: { fontSize: 12, color: colors.text.secondary, fontWeight: '800', marginTop: 2 },
    fullWidthBtn: { height: 65, marginTop: spacing.sm, marginBottom: spacing.xl },
    fullWidthGlass: { flex: 1, borderRadius: 22 },
    btnContent: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    btnText: { fontSize: 13, color: colors.primary, fontWeight: '900', marginRight: 12, letterSpacing: 1 },
    deptCard: { marginBottom: spacing.md, height: 95, borderRadius: 26 },
    deptRow: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg },
    deptIcon: { width: 44, height: 44 },
    deptIconInner: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.04)', justifyContent: 'center', alignItems: 'center' },
    deptInfo: { flex: 1, marginLeft: 15 },
    deptName: { fontSize: 16, fontWeight: '900', color: colors.text.primary },
    deptType: { fontSize: 11, color: colors.text.secondary, fontWeight: '700' },
    deptNavBtn: { width: 46, height: 46 },
    locationPlaceholder: { paddingVertical: spacing.xl, alignItems: 'center' },
    locationPlaceholderText: { marginTop: 10, fontSize: 14, color: colors.text.secondary, fontWeight: '700' }
});
