import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../../core/theme';
import { useLanguage } from '../../store/languageStore';

const { width, height } = Dimensions.get('window');

export default function KisanSetuSplashScreen() {
    const navigation = useNavigation();
    const { t, language, changeLanguage } = useLanguage();
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [animationProgress] = useState(new Animated.Value(0));

    const languages = [
        { code: 'en', label: 'English', nativeLabel: 'English', icon: '🇬🇧' },
        { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', icon: '🇮🇳' },
        { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', icon: '🌾' },
    ];

    // Animate on mount
    useEffect(() => {
        Animated.timing(animationProgress, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, []);

    const handleStart = () => {
        navigation.replace('Login');
    };

    const handleLanguageSelect = async (langCode) => {
        await changeLanguage(langCode);
        setShowLanguageSelector(false);
    };

    // Animation values
    const logoScale = animationProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
    });

    const titleOpacity = animationProgress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.3, 1],
    });

    const buttonTranslateY = animationProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Gradient Background with agricultural theme */}
            <ImageBackground
                source={{ uri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ecfdf5" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>' }}
                style={styles.backgroundImage}
            >
                {/* Main Content */}
                <View style={styles.content}>
                    {/* Decorative Elements */}
                    <View style={styles.decorativeTop}>
                        <Text style={styles.decorativeEmoji}>🌾</Text>
                        <Text style={styles.decorativeEmoji}>🚜</Text>
                        <Text style={styles.decorativeEmoji}>🌾</Text>
                    </View>

                    {/* Logo Section */}
                    <Animated.View
                        style={[
                            styles.logoSection,
                            {
                                transform: [{ scale: logoScale }],
                            },
                        ]}
                    >
                        <View style={styles.logoContainer}>
                            <View style={styles.mainLogoCircle}>
                                <Text style={styles.mainLogoEmoji}>🌾</Text>
                            </View>
                            <View style={styles.subLogoCircle1}>
                                <Text style={styles.subLogoEmoji}>💧</Text>
                            </View>
                            <View style={styles.subLogoCircle2}>
                                <Text style={styles.subLogoEmoji}>⚡</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Title Section */}
                    <Animated.View
                        style={[
                            styles.titleSection,
                            {
                                opacity: titleOpacity,
                            },
                        ]}
                    >
                        <Text style={styles.kisanSetuTitle}>Kisan Setu</Text>
                        <Text style={styles.subtitle}>किसान सेतु</Text>
                        <Text style={styles.tagline}>
                            {t('splash.tagline') || '🌾 बुद्धिमान कृषि निर्णय प्रणाली'}
                        </Text>
                    </Animated.View>

                    {/* Features */}
                    <View style={styles.featuresContainer}>
                        <View style={styles.featureRow}>
                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>💧</Text>
                                <Text style={styles.featureText}>मिट्टी की नमी</Text>
                            </View>
                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>📊</Text>
                                <Text style={styles.featureText}>मौसम डेटा</Text>
                            </View>
                        </View>
                        <View style={styles.featureRow}>
                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>🚜</Text>
                                <Text style={styles.featureText}>सिंचाई सलाह</Text>
                            </View>
                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>💚</Text>
                                <Text style={styles.featureText}>संसाधन अनुकूलन</Text>
                            </View>
                        </View>
                    </View>

                    {/* Main Tagline */}
                    <View style={styles.mainTaglineContainer}>
                        <Text style={styles.mainTaglineTitle}>
                            किसानों को डेटा-संचालित निर्णयों से सशक्त बनाना
                        </Text>
                        <Text style={styles.mainTaglineSubtitle}>
                            Empower Farmers with Data-Driven Decisions
                        </Text>
                    </View>

                    {/* Language Selector Button */}
                    <TouchableOpacity
                        style={styles.languageButton}
                        onPress={() => setShowLanguageSelector(!showLanguageSelector)}
                    >
                        <Text style={styles.languageIcon}>🌐</Text>
                        <Text style={styles.languageButtonText}>
                            {languages.find(l => l.code === language)?.nativeLabel || 'English'}
                        </Text>
                        <Text style={styles.chevron}>
                            {showLanguageSelector ? '▲' : '▼'}
                        </Text>
                    </TouchableOpacity>

                    {/* Language Options */}
                    {showLanguageSelector && (
                        <View style={styles.languageOptions}>
                            {languages.map((lang) => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[
                                        styles.languageOption,
                                        language === lang.code && styles.languageOptionSelected,
                                    ]}
                                    onPress={() => handleLanguageSelect(lang.code)}
                                >
                                    <Text style={styles.languageOptionIcon}>{lang.icon}</Text>
                                    <Text
                                        style={[
                                            styles.languageOptionText,
                                            language === lang.code && styles.languageOptionTextSelected,
                                        ]}
                                    >
                                        {lang.nativeLabel}
                                    </Text>
                                    {language === lang.code && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Bottom Section */}
                <Animated.View
                    style={[
                        styles.bottomSection,
                        {
                            transform: [{ translateY: buttonTranslateY }],
                        },
                    ]}
                >
                    {/* Key Features Pills */}
                    <View style={styles.pillsContainer}>
                        <View style={styles.pill}>
                            <Text style={styles.pillText}>🔍 Real-time Monitoring</Text>
                        </View>
                        <View style={styles.pill}>
                            <Text style={styles.pillText}>📱 Offline-First</Text>
                        </View>
                    </View>

                    {/* Start Button */}
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={handleStart}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.startButtonText}>
                            {t('splash.start') || 'शुरू करें / Get Started'}
                        </Text>
                        <Text style={styles.startButtonArrow}>→</Text>
                    </TouchableOpacity>

                    {/* Footer Text */}
                    <Text style={styles.footerText}>
                        © 2024 Kisan Setu | Transforming Agriculture
                    </Text>
                </Animated.View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        paddingTop: spacing.xl,
    },
    decorativeTop: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: spacing.m,
        opacity: 0.6,
    },
    decorativeEmoji: {
        fontSize: 32,
    },

    // Logo Section
    logoSection: {
        marginVertical: spacing.xl,
        marginBottom: spacing.xxl,
    },
    logoContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    mainLogoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    mainLogoEmoji: {
        fontSize: 56,
    },
    subLogoCircle1: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.light.accent,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.light.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    subLogoCircle2: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.light.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.light.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    subLogoEmoji: {
        fontSize: 24,
    },

    // Title Section
    titleSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    kisanSetuTitle: {
        fontSize: 40,
        fontWeight: '700',
        color: colors.light.primary,
        marginBottom: spacing.s,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.light.primary,
        marginBottom: spacing.m,
    },
    tagline: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.light.textSecondary,
        textAlign: 'center',
    },

    // Features
    featuresContainer: {
        width: '100%',
        marginVertical: spacing.xl,
    },
    featureRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.m,
    },
    feature: {
        alignItems: 'center',
        flex: 1,
    },
    featureIcon: {
        fontSize: 28,
        marginBottom: spacing.s,
    },
    featureText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.light.text,
        textAlign: 'center',
    },

    // Main Tagline
    mainTaglineContainer: {
        marginVertical: spacing.l,
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.m,
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.light.primary,
    },
    mainTaglineTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.light.primary,
        marginBottom: spacing.s,
        textAlign: 'center',
    },
    mainTaglineSubtitle: {
        fontSize: 13,
        fontWeight: '400',
        color: colors.light.textSecondary,
        textAlign: 'center',
    },

    // Language Selector
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        backgroundColor: colors.light.surface,
        borderRadius: 12,
        marginVertical: spacing.m,
        borderWidth: 2,
        borderColor: colors.light.border,
        width: '100%',
        justifyContent: 'center',
    },
    languageIcon: {
        fontSize: 20,
        marginRight: spacing.m,
    },
    languageButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.light.text,
        flex: 1,
    },
    chevron: {
        fontSize: 12,
        color: colors.light.textSecondary,
    },

    // Language Options
    languageOptions: {
        width: '100%',
        backgroundColor: colors.light.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.light.border,
        overflow: 'hidden',
        marginVertical: spacing.s,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        borderBottomWidth: 1,
        borderBottomColor: colors.light.border,
    },
    languageOptionSelected: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    languageOptionIcon: {
        fontSize: 20,
        marginRight: spacing.m,
    },
    languageOptionText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.light.text,
        flex: 1,
    },
    languageOptionTextSelected: {
        color: colors.light.primary,
        fontWeight: '600',
    },
    checkmark: {
        fontSize: 18,
        color: colors.light.primary,
        fontWeight: '700',
    },

    // Bottom Section
    bottomSection: {
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.l,
        alignItems: 'center',
    },
    pillsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.m,
        marginBottom: spacing.l,
        flexWrap: 'wrap',
    },
    pill: {
        backgroundColor: colors.light.secondary,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        borderRadius: 20,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.light.text,
    },

    // Start Button
    startButton: {
        width: '100%',
        paddingVertical: spacing.m,
        backgroundColor: colors.light.primary,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
        shadowColor: colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.light.surface,
        marginRight: spacing.m,
    },
    startButtonArrow: {
        fontSize: 20,
        color: colors.light.surface,
    },

    // Footer
    footerText: {
        fontSize: 12,
        fontWeight: '400',
        color: colors.light.textSecondary,
        textAlign: 'center',
        marginTop: spacing.m,
    },
});
