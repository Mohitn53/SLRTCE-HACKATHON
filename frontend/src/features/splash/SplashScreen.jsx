import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MainBackground } from '../../components/MainBackground';
import { GlassCard } from '../../components/GlassCard';
import { colors, spacing, typography } from '../../core/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SplashScreen() {
    return (
        <MainBackground>
            <View style={styles.container}>
                <GlassCard style={styles.card} intensity={40}>
                    <MaterialCommunityIcons name="leaf" size={80} color={colors.primary} />
                    <Text style={styles.title}>Kisaan Setu</Text>
                    <Text style={styles.subtitle}>Harvesting Intelligence</Text>
                </GlassCard>
            </View>
        </MainBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    card: {
        alignItems: 'center',
        padding: spacing.xxl,
        borderRadius: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.text.primary,
        marginTop: spacing.lg,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text.secondary,
        fontWeight: '700',
        marginTop: 4,
    }
});
