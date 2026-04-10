import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors, spacing } from '../../core/theme';

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
                Animated.sequence([
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    })
                ])
            ).start()
        ]).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
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
                <View style={styles.iconCircle}>
                    <Text style={styles.logoEmoji}>🌾</Text>
                    <Animated.View style={[styles.glow, { transform: [{ rotate: spin }] }]} />
                </View>
                
                <Text style={styles.appName}>Kisaan Setu</Text>
                <View style={styles.loaderBarContainer}>
                    <Animated.View style={styles.loaderBar} />
                </View>
                <Text style={styles.loadingText}>Growing your future...</Text>
            </Animated.View>

            <View style={styles.bottomDecor}>
                <View style={[styles.leaf, { left: -20, bottom: -10, transform: [{ rotate: '-15deg' }] }]} />
                <View style={[styles.leaf, { right: -20, bottom: -10, transform: [{ rotate: '15deg' }] }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.l,
        position: 'relative',
    },
    logoEmoji: {
        fontSize: 60,
        zIndex: 2,
    },
    glow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: colors.light.primary,
        borderStyle: 'dashed',
        opacity: 0.3,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.light.primary,
        letterSpacing: 1,
    },
    loadingText: {
        marginTop: spacing.m,
        color: colors.light.textSecondary,
        fontSize: 14,
        fontStyle: 'italic',
    },
    loaderBarContainer: {
        width: 150,
        height: 4,
        backgroundColor: '#F1F1F1',
        borderRadius: 2,
        marginTop: spacing.xl,
        overflow: 'hidden',
    },
    loaderBar: {
        width: '40%',
        height: '100%',
        backgroundColor: colors.light.primary,
        borderRadius: 2,
    },
    bottomDecor: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 100,
        overflow: 'hidden',
    },
    leaf: {
        position: 'absolute',
        width: 100,
        height: 100,
        backgroundColor: colors.light.primary,
        opacity: 0.05,
        borderRadius: 50,
    }
});
