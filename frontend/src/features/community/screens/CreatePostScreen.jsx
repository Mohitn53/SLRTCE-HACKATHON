/**
 * Create Post Screen — Problem Posting with auto-tagging
 */
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { MainBackground } from '../../../components/MainBackground';
import { GlassCard } from '../../../components/GlassCard';
import { colors, spacing } from '../../../core/theme';
import { useCommunity } from '../../../store/communityStore';
import { useAuth } from '../../../store/authStore';
import { useLanguage } from '../../../store/languageStore';

const CATEGORIES = [
    { key: 'crops',      label: 'Crops',       icon: 'barley',        color: '#2E7D32' },
    { key: 'soil',       label: 'Soil',         icon: 'shovel',        color: '#795548' },
    { key: 'irrigation', label: 'Irrigation',   icon: 'water',         color: '#0288D1' },
    { key: 'pests',      label: 'Pests',        icon: 'bug',           color: '#E53935' },
    { key: 'weather',    label: 'Weather',      icon: 'cloud-outline', color: '#5C6BC0' },
];

const SUGGESTED_TAGS = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Mustard', 'Soil pH', 'Drip', 'Fungicide', 'Organic', 'Irrigation', 'Pest'];

const CreatePostScreen = () => {
    const { t } = useLanguage();
    const navigation = useNavigation();
    const { submitPost } = useCommunity();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [authorName, setAuthorName] = useState(user?.username || '');
    const [authorLocation, setAuthorLocation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [aiTagging, setAiTagging] = useState(false);

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            // Simulate AI auto-tagging from image
            setAiTagging(true);
            setTimeout(() => {
                setAiTagging(false);
                const autoTags = ['Wheat', 'Fungicide'];
                setSelectedTags(prev => [...new Set([...prev, ...autoTags])]);
                if (!selectedCategory) setSelectedCategory('pests');
            }, 1800);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !selectedCategory) return;
        setSubmitting(true);
        try {
            await submitPost({
                title: title.trim(),
                body: body.trim(),
                category: selectedCategory,
                tags: selectedTags,
                authorName: authorName.trim(),
                authorLocation: authorLocation.trim(),
            });
            navigation.goBack();
        } finally {
            setSubmitting(false);
        }
    };

    const isValid = title.trim().length > 0 && selectedCategory;

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <GlassCard style={styles.iconBtn} intensity={25} noPadding>
                                <Ionicons name="close" size={22} color={colors.text.primary} />
                            </GlassCard>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Ask the Community</Text>
                        <TouchableOpacity
                            style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
                            onPress={handleSubmit}
                            disabled={!isValid || submitting}
                        >
                            {submitting
                                ? <ActivityIndicator size="small" color="white" />
                                : <Text style={styles.submitBtnText}>Post</Text>
                            }
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.form}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Author Name and Location */}
                        <View style={styles.authorRow}>
                            <GlassCard style={styles.authorCard} intensity={25}>
                                <Text style={styles.inputLabel}>{t("createPost.authorName")}</Text>
                                <TextInput
                                    style={styles.singleLineInput}
                                    placeholder="Enter your name"
                                    placeholderTextColor={colors.text.muted}
                                    value={authorName}
                                    onChangeText={setAuthorName}
                                />
                            </GlassCard>
                            <View style={{ width: 10 }} />
                            <GlassCard style={styles.authorCard} intensity={25}>
                                <Text style={styles.inputLabel}>Location</Text>
                                <TextInput
                                    style={styles.singleLineInput}
                                    placeholder="District / State"
                                    placeholderTextColor={colors.text.muted}
                                    value={authorLocation}
                                    onChangeText={setAuthorLocation}
                                />
                            </GlassCard>
                        </View>

                        {/* Title */}
                        <GlassCard style={styles.inputCard} intensity={25}>
                            <Text style={styles.inputLabel}>Question / Title *</Text>
                            <TextInput
                                style={styles.titleInput}
                                placeholder="e.g. My wheat crop has yellow spots — what is this?"
                                placeholderTextColor={colors.text.muted}
                                value={title}
                                onChangeText={setTitle}
                                maxLength={120}
                                multiline
                            />
                            <Text style={styles.charCount}>{title.length}/120</Text>
                        </GlassCard>

                        {/* Body */}
                        <GlassCard style={styles.inputCard} intensity={25}>
                            <Text style={styles.inputLabel}>Details (optional but recommended)</Text>
                            <TextInput
                                style={styles.bodyInput}
                                placeholder="Describe the problem in detail — crop stage, field area, symptoms, what you've already tried..."
                                placeholderTextColor={colors.text.muted}
                                value={body}
                                onChangeText={setBody}
                                maxLength={1000}
                                multiline
                                textAlignVertical="top"
                            />
                        </GlassCard>

                        {/* Image Upload with AI Auto-Tag */}
                        <GlassCard style={styles.inputCard} intensity={25}>
                            <Text style={styles.inputLabel}>Upload Crop Image (AI will auto-tag)</Text>
                            <TouchableOpacity style={styles.imageUploadBox} onPress={pickImage}>
                                {aiTagging ? (
                                    <View style={styles.aiTaggingBox}>
                                        <ActivityIndicator color="#7C4DFF" />
                                        <Text style={styles.aiTaggingText}>AI analysing image & auto-tagging...</Text>
                                    </View>
                                ) : image ? (
                                    <View style={styles.imagePreviewBox}>
                                        <MaterialCommunityIcons name="check-circle" size={28} color="#4CAF50" />
                                        <Text style={styles.imagePreviewText}>Image attached. Tap to change.</Text>
                                    </View>
                                ) : (
                                    <View style={styles.imageUploadInner}>
                                        <MaterialCommunityIcons name="camera-plus-outline" size={36} color={colors.primary} />
                                        <Text style={styles.uploadLabel}>Tap to upload photo</Text>
                                        <Text style={styles.uploadSub}>AI will suggest tags & category</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </GlassCard>

                        {/* Category */}
                        <Text style={styles.sectionLabel}>Category *</Text>
                        <View style={styles.categoryGrid}>
                            {CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat.key}
                                    style={[
                                        styles.catChip,
                                        selectedCategory === cat.key && {
                                            backgroundColor: cat.color,
                                            borderColor: cat.color,
                                        }
                                    ]}
                                    onPress={() => setSelectedCategory(cat.key)}
                                >
                                    <MaterialCommunityIcons
                                        name={cat.icon}
                                        size={16}
                                        color={selectedCategory === cat.key ? 'white' : cat.color}
                                    />
                                    <Text style={[
                                        styles.catChipText,
                                        selectedCategory === cat.key && { color: 'white' }
                                    ]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Tags */}
                        <Text style={styles.sectionLabel}>{t("createPost.tagsLabel")}</Text>
                        <View style={styles.tagsGrid}>
                            {SUGGESTED_TAGS.map(tag => (
                                <TouchableOpacity
                                    key={tag}
                                    style={[
                                        styles.tagChip,
                                        selectedTags.includes(tag) && styles.tagChipActive
                                    ]}
                                    onPress={() => toggleTag(tag)}
                                >
                                    <Text style={[
                                        styles.tagChipText,
                                        selectedTags.includes(tag) && { color: colors.primary }
                                    ]}>
                                        #{tag}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Guidelines */}
                        <GlassCard style={styles.guidelinesCard} intensity={15}>
                            <View style={styles.guidelinesRow}>
                                <MaterialCommunityIcons name="information-outline" size={20} color={colors.primary} />
                                <Text style={styles.guidelinesTitle}>Posting Guidelines</Text>
                            </View>
                            <Text style={styles.guidelinesText}>
                                • Be specific about crop type, field conditions, and location.{'\n'}
                                • Include clear images for faster community + AI diagnosis.{'\n'}
                                • Accepted answers earn you +10 community points.{'\n'}
                                • Respect all community members. No spam or promotional posts.
                            </Text>
                        </GlassCard>

                        <View style={{ height: 80 }} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </MainBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, zIndex: 10 },
    headerTitle: { fontSize: 18, fontWeight: '900', color: colors.text.primary },
    iconBtn: { width: 42, height: 42, borderRadius: 21 },
    submitBtn: { backgroundColor: colors.primary, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 20 },
    submitBtnDisabled: { opacity: 0.4 },
    submitBtnText: { color: 'white', fontWeight: '900', fontSize: 15 },
    form: { paddingHorizontal: spacing.lg, paddingTop: 10 },
    authorRow: { flexDirection: 'row', marginBottom: 14 },
    authorCard: { flex: 1, borderRadius: 20 },
    singleLineInput: { fontSize: 15, fontWeight: '700', color: colors.text.primary, paddingVertical: 4 },
    inputCard: { borderRadius: 20, marginBottom: 14 },
    inputLabel: { fontSize: 12, fontWeight: '800', color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
    titleInput: { fontSize: 16, fontWeight: '700', color: colors.text.primary, lineHeight: 24 },
    charCount: { fontSize: 11, color: colors.text.muted, textAlign: 'right', marginTop: 4 },
    bodyInput: { fontSize: 14, fontWeight: '600', color: colors.text.primary, lineHeight: 22, minHeight: 90 },
    imageUploadBox: { borderWidth: 2, borderColor: 'rgba(0,0,0,0.08)', borderStyle: 'dashed', borderRadius: 16, overflow: 'hidden' },
    imageUploadInner: { alignItems: 'center', paddingVertical: 28 },
    uploadLabel: { fontSize: 15, fontWeight: '800', color: colors.primary, marginTop: 10 },
    uploadSub: { fontSize: 12, fontWeight: '600', color: colors.text.secondary, marginTop: 4 },
    aiTaggingBox: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, justifyContent: 'center' },
    aiTaggingText: { fontSize: 13, fontWeight: '700', color: '#7C4DFF' },
    imagePreviewBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 18, justifyContent: 'center' },
    imagePreviewText: { fontSize: 14, fontWeight: '700', color: '#4CAF50' },
    sectionLabel: { fontSize: 14, fontWeight: '900', color: colors.text.primary, marginBottom: 10, marginTop: 4 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
    catChip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.3)', gap: 6 },
    catChipText: { fontSize: 13, fontWeight: '800', color: colors.text.secondary },
    tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
    tagChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.3)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
    tagChipActive: { backgroundColor: colors.primary + '15', borderColor: colors.primary },
    tagChipText: { fontSize: 13, fontWeight: '600', color: colors.text.secondary },
    guidelinesCard: { borderRadius: 18, marginBottom: 14 },
    guidelinesRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    guidelinesTitle: { fontSize: 14, fontWeight: '800', color: colors.primary },
    guidelinesText: { fontSize: 13, fontWeight: '600', color: colors.text.secondary, lineHeight: 22 },
});

export default CreatePostScreen;
