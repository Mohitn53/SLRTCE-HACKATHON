import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, borderRadius, spacing } from '../core/theme';

export const GlassCard = ({ children, style, intensity = 55, tint = "light", noPadding = false }) => {
    return (
        <View style={[styles.outerContainer, style]}>
            <BlurView intensity={intensity} tint={tint} style={styles.blurContainer}>
                <View style={[
                    styles.childContainer, 
                    noPadding && styles.centered
                ]}>
                    {children}
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)', // Subtle white boundary
        backgroundColor: 'rgba(255, 255, 255, 0.25)', // Medium white tint as requested
        shadowColor: "rgba(0,0,0,0.05)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    blurContainer: {
        flex: 1,
    },
    childContainer: {
        padding: spacing.lg,
        backgroundColor: 'transparent',
    },
    centered: {
        padding: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    }
});
