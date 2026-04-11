import React from 'react';
import { StyleSheet, View, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../core/theme';

const { width, height } = Dimensions.get('window');

export const MainBackground = ({ children }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={colors.backgrounds.main}
                style={styles.gradient}
            />
            {/* Ambient Crop Overlay */}
            <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2000&auto=format&fit=crop' }} 
                style={styles.cropOverlay}
                imageStyle={{ opacity: 0.08, resizeMode: 'cover' }}
            />
            
            {/* Soft Orbs for Glassmorphism effect */}
            <View style={[styles.orb, styles.orb1]} />
            <View style={[styles.orb, styles.orb2]} />
            
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgrounds.main[0],
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    cropOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
    },
    orb: {
        position: 'absolute',
        borderRadius: 200,
        opacity: 0.25,
    },
    orb1: {
        width: 350,
        height: 350,
        backgroundColor: colors.primary,
        top: -100,
        right: -100,
    },
    orb2: {
        width: 300,
        height: 300,
        backgroundColor: colors.accent,
        bottom: 100,
        left: -150,
    }
});
