import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../features/splash/SplashScreen';
import KisanSetuSplashScreen from '../features/splash/KisanSetuSplashScreen';
import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';
import CameraScreen from '../features/camera/CameraScreen';
import DetectionScreen from '../features/detection/DetectionScreen';
import HistoryScreen from '../features/history/HistoryScreen';
import HomeScreen from '../features/home/HomeScreen';
import SettingsScreen from '../features/settings/SettingsScreen';
import SoilMoistureScreen from '../features/soil/SoilMoistureScreen';
import { colors } from '../core/theme';
import { useAuth } from '../store/authStore';
import { useLanguage } from '../store/languageStore';

import MainLoader from '../features/splash/MainLoader';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { token, isLoading: authLoading } = useAuth();
    const { isLoading: langLoading } = useLanguage();
    const [hasSeenSplash, setHasSeenSplash] = useState(false);
    const [checkingSplash, setCheckingSplash] = useState(true);

    // Check if user has seen the main language/intro splash
    const [hasSeenKisanSplash, setHasSeenKisanSplash] = useState(false);
    const [checkingKisanSplash, setCheckingKisanSplash] = useState(true);

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            // Check both splash statuses in parallel
            const [kisanSeen, splashSeen] = await Promise.all([
                AsyncStorage.getItem('has_seen_kisan_splash'),
                AsyncStorage.getItem('has_seen_splash')
            ]);

            setHasSeenKisanSplash(kisanSeen === 'true');
            setHasSeenSplash(splashSeen === 'true');
        } catch (error) {
            console.error('Error initializing app:', error);
        } finally {
            // Give the user time to appreciate the premium MainLoader
            setTimeout(() => {
                setCheckingKisanSplash(false);
                setCheckingSplash(false);
            }, 2500);
        }
    };


    if (authLoading || langLoading || checkingSplash || checkingKisanSplash) {
        return <MainLoader />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!hasSeenKisanSplash ? (
                    // Kisan Setu Splash (First time - language and intro)
                    <Stack.Screen
                        name="KisanSetuSplash"
                        component={KisanSetuSplashScreen}
                        listeners={{
                            focus: async () => {
                                await AsyncStorage.setItem('has_seen_kisan_splash', 'true');
                                setHasSeenKisanSplash(true);
                            }
                        }}
                    />
                ) : !hasSeenSplash ? (
                    // Original Splash Screen (shown once after Kisan)
                    <Stack.Screen
                        name="Splash"
                        component={SplashScreen}
                        listeners={{
                            focus: async () => {
                                await AsyncStorage.setItem('has_seen_splash', 'true');
                                setHasSeenSplash(true);
                            }
                        }}
                    />
                ) : token ? (
                    // Authenticated Stack
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Camera" component={CameraScreen} />
                        <Stack.Screen name="Detection" component={DetectionScreen} />
                        <Stack.Screen name="SoilMoisture" component={SoilMoistureScreen} />
                        <Stack.Screen name="History" component={HistoryScreen} />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                    </>
                ) : (
                    // Auth Stack
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
