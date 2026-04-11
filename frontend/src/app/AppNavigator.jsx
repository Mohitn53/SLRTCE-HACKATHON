import React from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { colors, spacing } from '../core/theme';
import { useAuth } from '../store/authStore';

// Screens
import HomeScreen from '../features/home/HomeScreen';
import CameraScreen from '../features/camera/CameraScreen';
import SoilMoistureScreen from '../features/soil/SoilMoistureScreen';
import CommunityFeedScreen from '../features/community/screens/CommunityFeedScreen';
import ChatbotScreen from '../features/chatbot/screens/ChatbotScreen';

import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';
import DetectionScreen from '../features/detection/DetectionScreen';
import HistoryScreen from '../features/history/HistoryScreen';
import SettingsScreen from '../features/settings/SettingsScreen';
import SeasonalAnalysisScreen from '../features/home/SeasonalAnalysisScreen';
import MainLoader from '../features/splash/MainLoader';

const { width } = Dimensions.get('window');
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused }) => {
                let iconName;
                if (route.name === 'HomeTab') iconName = 'home-variant';
                else if (route.name === 'ScanTab') iconName = 'camera-iris';
                else if (route.name === 'SoilTab') iconName = 'leaf';
                else if (route.name === 'CommunityTab') iconName = 'account-group';
                else if (route.name === 'AssistantTab') iconName = 'robot-happy';

                return (
                    <View style={styles.tabIconWrapper}>
                        <MaterialCommunityIcons 
                            name={iconName} 
                            size={focused ? 32 : 28} 
                            color={focused ? colors.primary : 'rgba(0,0,0,0.4)'} 
                        />
                        {focused && <View style={styles.tabActiveIndicator} />}
                    </View>
                );
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: 'rgba(0,0,0,0.4)',
            tabBarStyle: styles.tabBar,
            tabBarBackground: () => (
                <View style={styles.tabBgContainer}>
                    <BlurView 
                        intensity={95} 
                        tint="light" 
                        style={StyleSheet.absoluteFill} 
                    />
                </View>
            ),
            tabBarShowLabel: false,
        })}
    >
        <Tab.Screen name="HomeTab" component={HomeScreen} />
        <Tab.Screen name="ScanTab" component={CameraScreen} />
        <Tab.Screen name="SoilTab" component={SoilMoistureScreen} />
        <Tab.Screen name="CommunityTab" component={CommunityFeedScreen} />
        <Tab.Screen name="AssistantTab" component={ChatbotScreen} />
    </Tab.Navigator>
);

export default function AppNavigator() {
    const { token, isLoading } = useAuth();

    if (isLoading) return <MainLoader />;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
                {token ? (
                    <>
                        <Stack.Screen name="Main" component={TabNavigator} />
                        <Stack.Screen name="Detection" component={DetectionScreen} />
                        <Stack.Screen name="History" component={HistoryScreen} />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                        <Stack.Screen name="SeasonalAnalysis" component={SeasonalAnalysisScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        height: 75,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
        paddingBottom: 0, // Ensure no padding pushes icons up
    },
    tabBgContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 38,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.7)',
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    tabIconWrapper: {
        width: 60,
        height: 75, // Match tab bar height exactly
        alignItems: 'center',
        justifyContent: 'center', // Vertically center the icon
        paddingTop: 10, // Slight offset to leave room for the dot at bottom
    },
    tabActiveIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
        position: 'absolute',
        bottom: 12, // Precisely placed at the bottom of the bar
    }
});
