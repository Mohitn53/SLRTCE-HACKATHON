import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius } from '../../core/theme';
import { useAuth } from '../../store/authStore';
import { useLanguage } from '../../store/languageStore';
import { getHistory } from '../../services/uploadService';
import { MainBackground } from '../../components/MainBackground';
import { GlassCard } from '../../components/GlassCard';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const LANGUAGES = [
    { code: 'en', label: 'English', nativeLabel: 'English', icon: '🇬🇧' },
    { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', icon: '🇮🇳' },
    { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', icon: '🇮🇳' },
];

export default function SettingsScreen() {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const { t, language, changeLanguage } = useLanguage();
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [scanCount, setScanCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const history = await getHistory();
                setScanCount(history?.length || 0);
            } catch (e) {
                console.log('Stats fetch error', e);
            }
        };
        fetchStats();
    }, []);

    const handleLanguageSelect = async (langCode) => {
        await changeLanguage(langCode);
        setShowLanguageModal(false);
    };

    const currentLanguage = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                        <Ionicons name="chevron-back" size={28} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('settings.accountCenter') === 'settings.accountCenter' ? 'Account Center' : t('settings.accountCenter')}</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <GlassCard style={styles.profileHero} intensity={15}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatarMain}>
                                <Text style={styles.avatarChar}>{user?.username?.charAt(0).toUpperCase() || 'F'}</Text>
                            </View>
                            <TouchableOpacity style={styles.editBadge}>
                                <MaterialCommunityIcons name="pencil" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.profileName}>{user?.username || (t('settings.fallbackName') === 'settings.fallbackName' ? 'Aggie Farmer' : t('settings.fallbackName'))}</Text>
                        <Text style={styles.profileSub}>{user?.email || (t('settings.fallbackEmail') === 'settings.fallbackEmail' ? 'Active Member' : t('settings.fallbackEmail'))}</Text>
                        
                        <View style={styles.statsStrip}>
                            <View style={styles.statBox}>
                                <Text style={styles.statVal}>{scanCount}</Text>
                                <Text style={styles.statLab}>{t('settings.totalScans') === 'settings.totalScans' ? 'Total Scans' : t('settings.totalScans')}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statBox}>
                                <Text style={styles.statVal}>AI</Text>
                                <Text style={styles.statLab}>{t('settings.verified') === 'settings.verified' ? 'Verified' : t('settings.verified')}</Text>
                            </View>
                        </View>
                    </GlassCard>

                    <Text style={styles.labelGroup}>{t('settings.preferences') === 'settings.preferences' ? 'Preferences' : t('settings.preferences')}</Text>

                    <TouchableOpacity onPress={() => setShowLanguageModal(true)} activeOpacity={0.7}>
                        <GlassCard style={styles.settingRow} intensity={20}>
                            <View style={styles.settingLead}>
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(79, 195, 247, 0.1)' }]}>
                                    <MaterialCommunityIcons name="translate" size={24} color={colors.accent} />
                                </View>
                                <View>
                                    <Text style={styles.settingMain}>{t('settings.displayLanguage') === 'settings.displayLanguage' ? 'Display Language' : t('settings.displayLanguage')}</Text>
                                    <Text style={styles.settingSub}>{currentLanguage.nativeLabel}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                        </GlassCard>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7}>
                        <GlassCard style={styles.settingRow} intensity={20}>
                            <View style={styles.settingLead}>
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(46, 125, 50, 0.1)' }]}>
                                    <MaterialCommunityIcons name="bell-ring-outline" size={24} color={colors.primary} />
                                </View>
                                <View>
                                    <Text style={styles.settingMain}>{t('settings.aiNotifications') === 'settings.aiNotifications' ? 'AI Notifications' : t('settings.aiNotifications')}</Text>
                                    <Text style={styles.settingSub}>{t('settings.instantAlerts') === 'settings.instantAlerts' ? 'Instant alerts active' : t('settings.instantAlerts')}</Text>
                                </View>
                            </View>
                            <View style={styles.customSwitch}>
                                <View style={styles.switchCircle} />
                            </View>
                        </GlassCard>
                    </TouchableOpacity>

                    <Text style={styles.labelGroup}>{t('settings.system') === 'settings.system' ? 'System' : t('settings.system')}</Text>

                    <GlassCard style={styles.multiCard} intensity={15}>
                        <TouchableOpacity style={styles.multiRow}>
                            <MaterialCommunityIcons name="information-outline" size={22} color={colors.text.secondary} />
                            <Text style={styles.multiText}>{t('settings.appDetails') === 'settings.appDetails' ? 'App Details' : t('settings.appDetails')}</Text>
                            <Text style={styles.versionTag}>v1.5.2</Text>
                        </TouchableOpacity>
                        <View style={styles.innerDivider} />
                        <TouchableOpacity style={styles.multiRow} onPress={logout}>
                            <MaterialCommunityIcons name="logout" size={22} color="#EF5350" />
                            <Text style={[styles.multiText, { color: '#EF5350' }]}>{t('settings.signOut') === 'settings.signOut' ? 'Sign Out' : t('settings.signOut')}</Text>
                        </TouchableOpacity>
                    </GlassCard>

                    <View style={{ height: 120 }} />
                </ScrollView>

                <Modal visible={showLanguageModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity style={styles.modalCloser} activeOpacity={1} onPress={() => setShowLanguageModal(false)} />
                        <View style={styles.sheetContainer}>
                            <BlurView intensity={100} tint="light" style={styles.sheetBlur}>
                                <View style={styles.sheetHandle} />
                                <Text style={styles.sheetTitle}>{t('settings.localization') === 'settings.localization' ? 'Localization' : t('settings.localization')}</Text>
                                {LANGUAGES.map((lang) => (
                                    <TouchableOpacity 
                                        key={lang.code} 
                                        onPress={() => handleLanguageSelect(lang.code)}
                                        style={[styles.langItem, language === lang.code && styles.langItemActive]}
                                    >
                                        <View style={styles.langItemLeft}>
                                            <Text style={styles.langEmoji}>{lang.icon}</Text>
                                            <Text style={[styles.langLabel, language === lang.code && { color: 'white' }]}>{lang.nativeLabel}</Text>
                                        </View>
                                        {language === lang.code && <Ionicons name="checkmark-circle" size={24} color="white" />}
                                    </TouchableOpacity>
                                ))}
                                <View style={{ height: 40 }} />
                            </BlurView>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </MainBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    headerBtn: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: '900', color: colors.text.primary, letterSpacing: -0.5 },
    scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
    profileHero: { alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.xl, borderRadius: 30 },
    avatarContainer: { marginBottom: spacing.md, position: 'relative' },
    avatarMain: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarChar: { fontSize: 42, fontWeight: '900', color: 'white' },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.secondary,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    profileName: { fontSize: 24, fontWeight: '900', color: colors.text.primary },
    profileSub: { fontSize: 13, color: colors.text.secondary, fontWeight: '700', marginTop: 2 },
    statsStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xl,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    statBox: { alignItems: 'center' },
    statVal: { fontSize: 18, fontWeight: '900', color: colors.text.primary },
    statLab: { fontSize: 12, color: colors.text.secondary, fontWeight: '700' },
    statDivider: { width: 1, height: 24, backgroundColor: 'rgba(0,0,0,0.1)', marginHorizontal: 30 },
    labelGroup: { fontSize: 15, fontWeight: '800', color: colors.text.primary, marginBottom: spacing.sm, marginLeft: 4, marginTop: spacing.lg },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, marginBottom: spacing.sm, borderRadius: 20 },
    settingLead: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
    settingMain: { fontSize: 16, fontWeight: '800', color: colors.text.primary },
    settingSub: { fontSize: 12, color: colors.text.secondary, fontWeight: '600' },
    customSwitch: { width: 40, height: 22, borderRadius: 11, backgroundColor: colors.primary, justifyContent: 'center', paddingHorizontal: 2 },
    switchCircle: { width: 18, height: 18, borderRadius: 9, backgroundColor: 'white', alignSelf: 'flex-end' },
    multiCard: { paddingVertical: 2, marginBottom: spacing.xl, borderRadius: 24 },
    multiRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg },
    multiText: { flex: 1, marginLeft: 15, fontSize: 15, fontWeight: '700', color: colors.text.primary },
    versionTag: { fontSize: 12, color: colors.text.secondary, fontWeight: '800' },
    innerDivider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginHorizontal: spacing.lg },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
    modalCloser: { flex: 1 },
    sheetContainer: { borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
    sheetBlur: { padding: spacing.xl, alignItems: 'center' },
    sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.08)', marginBottom: spacing.xl },
    sheetTitle: { fontSize: 22, fontWeight: '900', color: colors.text.primary, marginBottom: spacing.lg },
    langItem: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 18, marginBottom: spacing.sm },
    langItemActive: { backgroundColor: colors.primary },
    langItemLeft: { flexDirection: 'row', alignItems: 'center' },
    langEmoji: { fontSize: 20 },
    langLabel: { fontSize: 17, fontWeight: '800', color: colors.text.primary, marginLeft: 12 }
});
