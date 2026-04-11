import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius } from '../../core/theme';
import { MainBackground } from '../../components/MainBackground';
import { GlassCard } from '../../components/GlassCard';

const { width } = Dimensions.get('window');

export default function KisanSetuSplashScreen() {
    const fadeAnim = Animated.useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <MainBackground>
            <View style={styles.container}>
                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                    <GlassCard style={styles.iconContainer} intensity={20}>
                        <Text style={styles.emoji}>🌿</Text>
                    </GlassCard>
                    <Text style={styles.title}>Kisaan Setu</Text>
                    <Text style={styles.tagline}>Smart Agriculture Hub</Text>
                </Animated.View>
            </View>
        </MainBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    emoji: {
        fontSize: 60,
    },
    title: {
        fontSize: 40,
        fontWeight: '900',
        color: colors.text.primary,
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.secondary,
        marginTop: spacing.xs,
    }
});
