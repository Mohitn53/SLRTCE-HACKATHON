import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius } from '../../../core/theme';
import { useAuth } from '../../../store/authStore';
import { useLanguage } from '../../../store/languageStore';
import { MainBackground } from '../../../components/MainBackground';
import { GlassCard } from '../../../components/GlassCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
    const navigation = useNavigation();
    const { register } = useAuth();
    const { t } = useLanguage();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!username || !email || !password) {
            setError('Please fill in all the details.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await register(username, email, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainBackground>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                    style={styles.keyboardView}
                >
                    <ScrollView 
                        contentContainerStyle={styles.scrollContent} 
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.innerContent}>
                            <View style={styles.brandingContainer}>
                                <GlassCard style={styles.brandIconGlass} intensity={20}>
                                    <MaterialCommunityIcons name="spa" size={50} color={colors.primary} />
                                </GlassCard>
                                <Text style={styles.appTitle}>{t("auth.registerTitle")}</Text>
                                <Text style={styles.appSubtitle}>Start your smart farming journey</Text>
                            </View>

                            <GlassCard style={styles.formCard} intensity={50}>
                                <Text style={styles.formHeader}>{t('auth.register')}</Text>
                                
                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                <View style={styles.inputWrapper}>
                                    <View style={styles.inputBox}>
                                        <MaterialCommunityIcons name="account" size={20} color={colors.primary} style={styles.inputPrefix} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder={t('auth.username')}
                                            placeholderTextColor={colors.text.secondary + '80'}
                                            value={username}
                                            onChangeText={setUsername}
                                            autoCapitalize="none"
                                        />
                                    </View>

                                    <View style={styles.inputBox}>
                                        <MaterialCommunityIcons name="email" size={20} color={colors.primary} style={styles.inputPrefix} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder={t('auth.email')}
                                            placeholderTextColor={colors.text.secondary + '80'}
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                    </View>

                                    <View style={styles.inputBox}>
                                        <MaterialCommunityIcons name="lock" size={20} color={colors.primary} style={styles.inputPrefix} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder={t('auth.password')}
                                            placeholderTextColor={colors.text.secondary + '80'}
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.primaryAction, isSubmitting && styles.actionDisabled]}
                                    onPress={handleRegister}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.actionLabel}>{t('auth.registerButton')}</Text>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.footerLinkRow}>
                                    <Text style={styles.footerText}>Already have an account?</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={styles.footerLink}> {t('auth.loginButton')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </GlassCard>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </MainBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1 },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    innerContent: {
        width: '100%',
        alignItems: 'center',
    },
    brandingContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
        marginTop: spacing.xl,
    },
    brandIconGlass: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        padding: 0,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    appTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.text.primary,
        letterSpacing: -1,
    },
    appSubtitle: {
        fontSize: 14,
        color: colors.text.secondary,
        fontWeight: '700',
        opacity: 0.8,
    },
    formCard: {
        width: '100%',
        padding: spacing.xl,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    formHeader: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text.primary,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    inputWrapper: { marginBottom: spacing.xl },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 15,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
        height: 60,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    inputPrefix: { marginRight: spacing.sm },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: colors.text.primary,
        fontWeight: '600',
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        marginBottom: spacing.md,
        fontWeight: '700',
        fontSize: 13,
    },
    primaryAction: {
        backgroundColor: colors.primary,
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    actionDisabled: { opacity: 0.6 },
    actionLabel: {
        color: 'white',
        fontSize: 18,
        fontWeight: '900',
    },
    footerLinkRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    footerText: {
        color: colors.text.secondary,
        fontWeight: '600',
    },
    footerLink: {
        color: colors.primary,
        fontWeight: '900',
    }
});
