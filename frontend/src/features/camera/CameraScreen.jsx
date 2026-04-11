import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, Platform, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, borderRadius } from '../../core/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLanguage } from '../../store/languageStore';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
    const { t } = useLanguage();

    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const [facing, setFacing] = useState('back');
    const [isCapturing, setIsCapturing] = useState(false);
    const [flash, setFlash] = useState('off');

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const takePicture = async () => {
        if (cameraRef.current && !isCapturing) {
            setIsCapturing(true);
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                });
                navigation.navigate('Detection', { imageUri: photo.uri });
            } catch (e) {
                Alert.alert('Error', 'Failed to capture image');
            } finally {
                setIsCapturing(false);
            }
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });

        if (!result.canceled) {
            navigation.navigate('Detection', { imageUri: result.assets[0].uri });
        }
    };

    if (!permission) return <View style={styles.container} />;

    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <MaterialCommunityIcons name="camera-off" size={64} color={colors.primary} />
                <Text style={styles.message}>Camera access is required for detecting crop diseases.</Text>
                <TouchableOpacity style={styles.grantButton} onPress={requestPermission}>
                    <Text style={styles.grantButtonText}>Enable Camera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView 
                style={StyleSheet.absoluteFill} 
                facing={facing} 
                ref={cameraRef}
                enableTorch={flash === 'on'}
            >
                <SafeAreaView style={styles.overlay}>
                    {/* Top Bar */}
                    <View style={styles.topBar}>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name="close-circle" size={44} color="white" />
                        </TouchableOpacity>
                        
                        <View style={styles.scanBadge}>
                            <BlurView intensity={20} tint="dark" style={styles.badgeBlur}>
                                <Text style={styles.badgeText}>SMART SCANNER</Text>
                            </BlurView>
                        </View>

                        <TouchableOpacity style={styles.iconBtn} onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}>
                            <Ionicons name="camera-reverse-outline" size={32} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Controls */}
                    <View style={styles.bottomSection}>
                        <View style={styles.controlsRow}>
                            <TouchableOpacity style={styles.sideBtn} onPress={pickImage}>
                                <MaterialCommunityIcons name="image-area" size={32} color="white" />
                                <Text style={styles.sideBtnText}>{t("camera.gallery")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.captureBtn} 
                                onPress={takePicture}
                                disabled={isCapturing}
                            >
                                <View style={styles.captureInner}>
                                    {isCapturing ? <ActivityIndicator color={colors.primary} /> : <View style={styles.captureDot} />}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.sideBtn} 
                                onPress={() => setFlash(f => f === 'off' ? 'on' : 'off')}
                            >
                                <MaterialCommunityIcons 
                                    name={flash === 'on' ? 'flashlight' : 'flashlight-off'} 
                                    size={32} 
                                    color={flash === 'on' ? colors.warning : 'white'} 
                                />
                                <Text style={styles.sideBtnText}>Flash</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.tipContainer}>
                            <Text style={styles.tipText}>Point at the affected leaf for best results</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: 'white' },
    message: { fontSize: 16, textAlign: 'center', color: colors.text.secondary, marginVertical: 20, fontWeight: '600' },
    grantButton: { backgroundColor: colors.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 15 },
    grantButtonText: { color: 'white', fontWeight: '900' },
    overlay: { flex: 1, justifyContent: 'space-between' },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
    iconBtn: { padding: 5 },
    scanBadge: { overflow: 'hidden', borderRadius: 20 },
    badgeBlur: { paddingHorizontal: 16, paddingVertical: 8 },
    badgeText: { color: 'white', fontSize: 12, fontWeight: '900', letterSpacing: 2 },
    bottomSection: { paddingBottom: 110 }, // Increased from 50 to sit above the floating tab bar
    controlsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 },
    sideBtn: { alignItems: 'center', width: 80 },
    sideBtnText: { color: 'white', fontSize: 12, fontWeight: '800', marginTop: 4 },
    captureBtn: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'white' },
    captureInner: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
    captureDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, opacity: 0.1 },
    tipContainer: { alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
    tipText: { color: 'white', fontSize: 13, fontWeight: '700' }
});
