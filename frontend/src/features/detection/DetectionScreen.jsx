import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity, SafeAreaView, Alert, TextInput, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { uploadImage } from '../../services/uploadService';
import { colors, spacing, typography, borderRadius } from '../../core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../../store/languageStore';
import { MainBackground } from '../../components/MainBackground';
import { GlassCard } from '../../components/GlassCard';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DetectionScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { imageUri } = route.params;
    const { t, language } = useLanguage();

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [feedbackComment, setFeedbackComment] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [isHelpful, setIsHelpful] = useState(null);

    useEffect(() => {
        processImage();
    }, []);

    const processImage = async () => {
        try {
            const data = await uploadImage(imageUri);
            setResult(data.scan);
        } catch (err) {
            setError(t('detection.errorText') || 'Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const speakReport = () => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
            return;
        }

        let text = `${result.plant} detected. Condition: ${result.condition}. `;
        if (result.fullReport?.message) text += result.fullReport.message;

        setIsSpeaking(true);
        Speech.speak(text, {
            language: language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN',
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
        });
    };

    if (loading) {
        return (
            <MainBackground>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>AI Processing...</Text>
                </View>
            </MainBackground>
        );
    }

    if (error) {
        return (
            <MainBackground>
                <View style={styles.centered}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={64} color={colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.retryText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </MainBackground>
        );
    }

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={28} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Diagnosis</Text>
                    <TouchableOpacity onPress={speakReport} style={styles.voiceBtn}>
                        <MaterialCommunityIcons name={isSpeaking ? "stop" : "volume-high"} size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <GlassCard style={styles.imageCard} intensity={20}>
                        <Image source={{ uri: imageUri }} style={styles.resultImage} />
                        <GlassCard style={styles.confidenceBadge} intensity={80}>
                            <Text style={styles.confidenceText}>{Math.round((result?.confidence || 0) * 100)}% Match</Text>
                        </GlassCard>
                    </GlassCard>

                    <GlassCard style={styles.mainDiagnosis}>
                        <Text style={styles.plantTag}>{result.plant || 'Unidentified Plant'}</Text>
                        <Text style={styles.conditionTitle}>{result.condition || 'Healthy'}</Text>
                        
                        <View style={[styles.statusRow, { backgroundColor: result.status === 'HEALTHY' ? colors.primary + '20' : colors.error + '20' }]}>
                            <MaterialCommunityIcons 
                                name={result.status === 'HEALTHY' ? "check-circle" : "alert-rhombus"} 
                                size={20} 
                                color={result.status === 'HEALTHY' ? colors.primary : colors.error} 
                            />
                            <Text style={[styles.statusText, { color: result.status === 'HEALTHY' ? colors.primary : colors.error }]}>
                                {result.status}
                            </Text>
                        </View>
                    </GlassCard>

                    {result.fullReport?.message && (
                        <GlassCard style={styles.reportCard}>
                            <Text style={styles.sectionTitle}>AI Observation</Text>
                            <Text style={styles.reportText}>{result.fullReport.message}</Text>
                        </GlassCard>
                    )}

                    <Text style={styles.sectionLabel}>Solutions & Management</Text>
                    
                    {/* Organic Solutions */}
                    {result.fullReport?.organic?.length > 0 && (
                        <GlassCard style={styles.solutionCard}>
                            <View style={styles.solutionHeader}>
                                <Text style={styles.solutionIcon}>🌿</Text>
                                <Text style={styles.solutionTitle}>Organic Treatment</Text>
                            </View>
                            {result.fullReport.organic.map((item, idx) => (
                                <View key={idx} style={styles.bulletItem}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.bulletText}>{item}</Text>
                                </View>
                            ))}
                        </GlassCard>
                    )}

                    {/* Chemical Solutions */}
                    {result.fullReport?.chemical?.length > 0 && (
                        <GlassCard style={styles.solutionCard}>
                            <View style={styles.solutionHeader}>
                                <Text style={styles.solutionIcon}>💊</Text>
                                <Text style={styles.solutionTitle}>Chemical Treatment</Text>
                            </View>
                            {result.fullReport.chemical.map((item, idx) => (
                                <View key={idx} style={styles.bulletItem}>
                                    <View style={[styles.bullet, { backgroundColor: colors.accent }]} />
                                    <Text style={styles.bulletText}>{item}</Text>
                                </View>
                            ))}
                        </GlassCard>
                    )}

                    {/* Prevention */}
                    {result.fullReport?.prevention?.length > 0 && (
                        <GlassCard style={styles.solutionCard}>
                            <View style={styles.solutionHeader}>
                                <Text style={styles.solutionIcon}>🛡️</Text>
                                <Text style={styles.solutionTitle}>Prevention Tips</Text>
                            </View>
                            {result.fullReport.prevention.map((item, idx) => (
                                <View key={idx} style={styles.bulletItem}>
                                    <View style={[styles.bullet, { backgroundColor: colors.warning }]} />
                                    <Text style={styles.bulletText}>{item}</Text>
                                </View>
                            ))}
                        </GlassCard>
                    )}

                    {/* Feedback */}
                    {!feedbackSubmitted && (
                        <GlassCard style={styles.feedbackCard} intensity={25}>
                            <Text style={styles.feedbackTitle}>Was this helpful?</Text>
                            <View style={styles.feedbackChoices}>
                                <TouchableOpacity 
                                    style={[styles.choiceBtn, isHelpful === true && styles.choiceActive]} 
                                    onPress={() => setIsHelpful(true)}
                                >
                                    <MaterialCommunityIcons name="thumb-up" size={24} color={isHelpful === true ? 'white' : colors.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.choiceBtn, isHelpful === false && styles.choiceActive]} 
                                    onPress={() => setIsHelpful(false)}
                                >
                                    <MaterialCommunityIcons name="thumb-down" size={24} color={isHelpful === false ? 'white' : colors.error} />
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={styles.feedbackInput}
                                placeholder="Add comments..."
                                placeholderTextColor={colors.text.secondary}
                                value={feedbackComment}
                                onChangeText={setFeedbackComment}
                                multiline
                            />
                            <TouchableOpacity style={styles.submitBtn} onPress={() => setFeedbackSubmitted(true)}>
                                <Text style={styles.submitText}>Submit AI Feedback</Text>
                            </TouchableOpacity>
                        </GlassCard>
                    )}

                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>
        </MainBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    loadingText: {
        marginTop: spacing.md,
        ...typography.subtitle,
        color: colors.text.primary,
        fontWeight: '700',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    headerTitle: {
        ...typography.header,
        color: colors.text.primary,
    },
    backBtn: { padding: 4 },
    voiceBtn: { padding: 4 },
    content: {
        padding: spacing.lg,
    },
    imageCard: {
        padding: 0,
        height: 250,
        overflow: 'hidden',
        marginBottom: spacing.xl,
    },
    resultImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    confidenceBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    confidenceText: {
        color: colors.text.primary,
        fontWeight: '900',
        fontSize: 12,
    },
    mainDiagnosis: {
        padding: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    plantTag: {
        fontSize: 14,
        color: colors.text.secondary,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    conditionTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusText: {
        marginLeft: 8,
        fontWeight: '800',
        fontSize: 14,
    },
    sectionLabel: {
        ...typography.subtitle,
        color: colors.text.primary,
        fontWeight: '800',
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    reportCard: {
        padding: spacing.lg,
    },
    sectionTitle: {
        ...typography.body,
        fontWeight: '800',
        color: colors.text.primary,
        marginBottom: 8,
    },
    reportText: {
        ...typography.body,
        color: colors.text.secondary,
        lineHeight: 22,
        fontWeight: '600',
    },
    solutionCard: {
        marginBottom: spacing.md,
        padding: spacing.lg,
    },
    solutionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    solutionIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    solutionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.text.primary,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    bullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginTop: 6,
        marginRight: 12,
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        color: colors.text.secondary,
        lineHeight: 20,
        fontWeight: '600',
    },
    feedbackCard: {
        marginTop: spacing.xl,
        padding: spacing.xl,
        alignItems: 'center',
    },
    feedbackTitle: {
        ...typography.subtitle,
        color: colors.text.primary,
        fontWeight: '800',
        marginBottom: spacing.lg,
    },
    feedbackChoices: {
        flexDirection: 'row',
        marginBottom: spacing.xl,
    },
    choiceBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: spacing.md,
    },
    choiceActive: {
        backgroundColor: colors.primary,
    },
    feedbackInput: {
        width: '100%',
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 12,
        padding: 12,
        color: colors.text.primary,
        fontWeight: '600',
        marginBottom: spacing.lg,
    },
    submitBtn: {
        backgroundColor: colors.primary,
        width: '100%',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 16,
    }
});
