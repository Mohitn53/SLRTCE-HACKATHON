import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../core/theme';
import { MainBackground } from '../../components/MainBackground';
import { GlassCard } from '../../components/GlassCard';

const { width, height } = Dimensions.get('window');

export default function MainLoader() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: true,
                })
            ).start()
        ]).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <MainBackground>
            <View style={styles.container}>
                <Animated.View 
                    style={[
                        styles.logoContainer, 
                        { 
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    <GlassCard style={styles.iconCircle} intensity={40}>
                        <Text style={styles.logoEmoji}>🌾</Text>
                        <Animated.View style={[styles.glow, { transform: [{ rotate: spin }] }]} />
                    </GlassCard>
                    
                    <Text style={styles.appName}>Kisaan Setu</Text>
                    <View style={styles.loaderBarContainer}>
                        <Animated.View style={styles.loaderBar} />
                    </View>
                    <Text style={styles.loadingText}>Cultivating Intelligence...</Text>
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
    logoContainer: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
        position: 'relative',
        padding: 0,
    },
    logoEmoji: {
        fontSize: 64,
        zIndex: 2,
    },
    glow: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        opacity: 0.4,
    },
    appName: {
        fontSize: 36,
        fontWeight: '900',
        color: colors.text.primary,
        letterSpacing: -1,
    },
    loadingText: {
        marginTop: spacing.md,
        color: colors.text.secondary,
        fontSize: 16,
        fontWeight: '600',
    },
    loaderBarContainer: {
        width: 200,
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        marginTop: spacing.xl,
        overflow: 'hidden',
    },
    loaderBar: {
        width: '60%',
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    }
});
