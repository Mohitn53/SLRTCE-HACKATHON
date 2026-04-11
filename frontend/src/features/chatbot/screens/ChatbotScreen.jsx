import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { MainBackground } from '../../../components/MainBackground';
import { GlassCard } from '../../../components/GlassCard';
import { colors, spacing, typography, borderRadius } from '../../../core/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../../../store/languageStore';
import { useAuth } from '../../../store/authStore';

// Assuming an environmental IP logic (often useful for expo). Update this based on standard backend IP
const BACKEND_URL = 'http://192.168.29.13:3000/api/chat/ask';

const ChatbotScreen = () => {
    const { t } = useLanguage();
    const { user } = useAuth(); // If available from auth store
    
    // Helper to bypass translation keys natively returning themselves if missing
    const tStr = (key, fallback) => {
        const val = t(key);
        return val === key ? fallback : val;
    };

    const [messages, setMessages] = useState([
        { id: '1', text: tStr('chatbot.welcome', 'Welcome to Kisaan Setu! I am your AI farming assistant. How can I help you maximize your yield today?'), sender: 'ai', context: [] },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const flatListRef = useRef();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true) // or some other action
        );
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false) // or some other action
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const quickSuggestions = [
        tStr('chatbot.q1', 'Should I water my crops?'),
        tStr('chatbot.q2', 'My leaves are turning yellow'),
        tStr('chatbot.q3', 'What fertilizer should I use?'),
        tStr('chatbot.q4', 'How to treat pests?'),
        tStr('chatbot.q5', 'Current soil health?')
    ];

    const sendMessage = async (customText = null) => {
        const messageText = typeof customText === 'string' ? customText : input;
        if (!messageText.trim()) return;

        const userMsgId = Date.now().toString();
        const userMsg = { id: userMsgId, text: messageText, sender: 'user' };
        
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        Keyboard.dismiss();
        setIsTyping(true);

        try {
            const reqBody = {
                message: messageText,
                history: messages.slice(-6).map(m => ({ role: m.sender === 'ai' ? 'model' : 'user', text: m.text })),
                contextFlags: ['soil', 'weather', 'scan'],
                userId: user?.id || user?._id || null, 
                location: user?.location || null
            };

            const res = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody)
            }).catch(() => null);

            let aiResponseText = tStr('chatbot.fallback', "I'm sorry, I couldn't reach the server. Please try again.");
            let contextUsed = [];

            if (res && res.ok) {
                const data = await res.json();
                aiResponseText = data.reply;
                contextUsed = data.context || [];
            } else {
                // FALLBACK FOR DEMO IF BACKEND ISN'T RUNNING
                await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000)); // Make it feel more realistic/slow
                const lowerMsg = messageText.toLowerCase();

                if (lowerMsg.includes('water') || lowerMsg.includes('irrigate') || lowerMsg.includes('पानी') || lowerMsg.includes('पाणी')) {
                    aiResponseText = tStr('chatbot.mockWater', "Your sensors show **Soil Moisture is at 62%** and the optimal range for Wheat is 60-70%.\n\nHowever, since my forecast indicates a **40% chance of light rain** tomorrow morning, I recommend pausing irrigation for now to prevent waterlogging and reduce costs.");
                    contextUsed = ['💧 ' + tStr('chatbot.q5', 'Soil Health'), '⛅ ' + tStr('home.feature2Title', 'Weather Context')];
                } else if (lowerMsg.includes('yellow') || lowerMsg.includes('pale') || lowerMsg.includes('पीले') || lowerMsg.includes('पिवळी')) {
                    aiResponseText = tStr('chatbot.mockYellow', "Yellowing leaves (chlorosis) usually point to a **Nitrogen deficiency** or poor drainage.\n\nChecking your recent logs, your soil drains well. Try applying a balanced NPK fertilizer (like 20-20-20) this week. If spots appear, please use the Detection scan to ensure it isn't rust.");
                    contextUsed = ['🌾 ' + tStr('home.feature1Title', 'Crop History'), '📍 Context Data'];
                } else if (lowerMsg.includes('fertilizer') || lowerMsg.includes('nutrient') || lowerMsg.includes('उर्वरक') || lowerMsg.includes('खत')) {
                    aiResponseText = tStr('chatbot.mockFertilizer', "Since it's the vegetative stage for your current crop, a nitrogen-rich fertilizer is best.\n\nRecommendation: Use **Urea (46-0-0)** at about 50kg per acre. Always water the field lightly after application so it seeps effectively into the root zone.");
                    contextUsed = ['🌱 Stage History', '🧪 ' + tStr('home.actionSoilHub', 'Soil Hub')];
                } else if (lowerMsg.includes('pest') || lowerMsg.includes('insect') || lowerMsg.includes('bug') || lowerMsg.includes('कीट') || lowerMsg.includes('कीड')) {
                    aiResponseText = tStr('chatbot.mockPest', "Pests like Aphids are common right now.\n\n**Organic fix:** Spray Neem oil mixed with a mild soap.\n**Chemical fix:** Imidacloprid (consult local guidelines first).\n\nPlease run an image scan so our AI can identify the exact insect type for a precise treatment plan!");
                    contextUsed = ['🐛 Local Pest Alerts'];
                } else if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('नमस्ते') || lowerMsg.includes('नमस्कार')) {
                    aiResponseText = tStr('chatbot.mockHello', "Hello! I'm Kisaan Setu AI. I can review your soil data, weather forecasts, and crop disease scans to give you tailored farming advice. What's on your mind today?");
                    contextUsed = [];
                } else {
                    aiResponseText = tStr('chatbot.mockDefault', "I see. To give you the most accurate agricultural advice, could you describe the specific symptoms or tell me exactly which crop we are discussing today?");
                    contextUsed = ['🤖 Kisaan Setu GenAI'];
                }
            }

            setMessages(prev => [...prev, { 
                id: (Date.now() + 1).toString(), 
                text: aiResponseText, 
                sender: 'ai',
                context: contextUsed
            }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { 
                id: (Date.now() + 1).toString(), 
                text: t('chatbot.error') || "I encountered an error connecting to my brain. Please check your network.", 
                sender: 'ai' 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const [typingDots, setTypingDots] = useState('');

    useEffect(() => {
        let interval;
        if (isTyping) {
            interval = setInterval(() => {
                setTypingDots(prev => prev.length >= 3 ? '' : prev + '.');
            }, 400);
        } else {
            setTypingDots('');
        }
        return () => clearInterval(interval);
    }, [isTyping]);

    useEffect(() => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
    }, [messages, isTyping]);

    const renderContextTags = (tags) => {
        if (!tags || tags.length === 0) return null;
        return (
            <View style={styles.contextContainer}>
                {tags.map((tag, idx) => (
                    <View key={idx} style={styles.contextBadge}>
                        <MaterialCommunityIcons name="brain" size={12} color={colors.secondary} />
                        <Text style={styles.contextText}>{tag}</Text>
                    </View>
                ))}
            </View>
        );
    }

    const renderMessage = ({ item }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.messageWrapper, isUser ? styles.userRow : styles.aiRow]}>
                {!isUser && (
                    <View style={styles.avatarContainer}>
                        <MaterialCommunityIcons name="robot-outline" size={20} color="white" />
                    </View>
                )}
                <View style={styles.bubbleContainer}>
                    <GlassCard 
                        style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}
                        intensity={isUser ? 20 : 60}
                        noPadding={true}
                    >
                        <View style={[styles.bubbleInner, isUser ? styles.userBubbleInner : styles.aiBubbleInner]}>
                            <Text style={isUser ? styles.userText : styles.aiText}>{item.text}</Text>
                            {renderContextTags(item.context)}
                        </View>
                    </GlassCard>
                </View>
            </View>
        );
    };

    return (
        <MainBackground>
            <SafeAreaView style={{flex: 1}}>
                <KeyboardAvoidingView 
                    style={styles.container} 
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{tStr('chatbot.title', 'Kisaan Setu AI')}</Text>
                        <Text style={styles.headerSubtitle}>{tStr('chatbot.subtitle', 'Context-Aware Farming Assistant')}</Text>
                    </View>

                    <FlatList
                        style={{ flex: 1 }}
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.chatList}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => 
                            isTyping ? (
                                <View style={[styles.messageWrapper, styles.aiRow, { marginBottom: 10 }]}>
                                    <View style={[styles.avatarContainer, { backgroundColor: 'transparent' }]}>
                                        <MaterialCommunityIcons name="robot-outline" size={20} color={colors.primary} />
                                    </View>
                                    <GlassCard style={[styles.messageBubble, styles.aiBubble, { paddingVertical: 8, paddingHorizontal: 12 }]} intensity={30} noPadding={true}>
                                        <View style={[styles.bubbleInner, styles.typingContainer, styles.aiBubbleInner, { padding: 4 }]}>
                                            <MaterialCommunityIcons name="brain" size={14} color={colors.primary} style={{ marginRight: 4 }} />
                                            <Text style={styles.typingText}>{tStr('chatbot.typing', 'Thinking')}{typingDots}</Text>
                                        </View>
                                    </GlassCard>
                                </View>
                            ) : null
                        }
                        keyboardShouldPersistTaps="handled"
                    />

                    <View style={styles.suggestionsContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {quickSuggestions.map((sug, idx) => (
                                <TouchableOpacity key={idx} onPress={() => sendMessage(sug)}>
                                    <View style={styles.suggestionBtn}>
                                        <Text style={styles.suggestionText}>{sug}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={[styles.inputCard, { borderColor: 'rgba(255,255,255,0.4)', borderWidth: 1, marginBottom: isKeyboardVisible ? 10 : (Platform.OS === 'ios' ? 100 : 90) }]}>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.textInput}
                                placeholder={tStr('chatbot.placeholder', 'Ask an agricultural question...')}
                                value={input}
                                onChangeText={setInput}
                                placeholderTextColor={colors.text.secondary}
                                multiline
                            />
                            <TouchableOpacity style={styles.micButton}>
                                <MaterialCommunityIcons name="microphone" size={22} color={colors.text.secondary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} onPress={() => sendMessage()}>
                                <MaterialCommunityIcons name="send" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </MainBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS==='android'?40:20 },
    header: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
    headerTitle: { ...typography.h1, color: colors.text.primary, fontSize: 28 },
    headerSubtitle: { ...typography.caption, color: colors.text.secondary, marginTop: -2, fontWeight: '600' },
    chatList: { paddingHorizontal: spacing.lg, paddingBottom: 20 },
    messageWrapper: { width: '100%', marginVertical: spacing.sm, flexDirection: 'row' },
    userRow: { justifyContent: 'flex-end' },
    aiRow: { justifyContent: 'flex-start' },
    avatarContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm, marginTop: 4 },
    bubbleContainer: { maxWidth: '85%' },
    messageBubble: { borderRadius: 20, overflow: 'hidden' },
    bubbleInner: { padding: spacing.md, paddingHorizontal: 16 },
    userBubbleInner: { backgroundColor: 'rgba(255,255,255,0.2)' },
    aiBubbleInner: { backgroundColor: 'rgba(255,255,255,0.7)' },
    userBubble: { backgroundColor: colors.glass.highlight, borderBottomRightRadius: 4 },
    aiBubble: { backgroundColor: 'rgba(255, 255, 255, 0.5)', borderWidth: 0, borderBottomLeftRadius: 4 },
    userText: { ...typography.body, color: colors.text.primary, fontWeight: '600' },
    aiText: { ...typography.body, color: colors.text.primary, fontWeight: '500', lineHeight: 22 },
    contextContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm, gap: 6 },
    contextBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
    contextText: { fontSize: 10, color: colors.primary, marginLeft: 4, fontWeight: '700' },
    typingContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
    typingText: { marginLeft: spacing.sm, color: colors.primary, fontSize: 13, fontStyle: 'italic', fontWeight: '600' },
    suggestionsContainer: { paddingHorizontal: spacing.lg, marginBottom: spacing.md, height: 44 },
    suggestionBtn: { marginRight: spacing.sm, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' },
    suggestionText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
    inputCard: { marginHorizontal: spacing.lg, borderRadius: 24, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.9)' },
    inputRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 60, maxHeight: 120 },
    textInput: { flex: 1, fontSize: 15, color: colors.text.primary, paddingTop: Platform.OS === 'ios' ? 12 : 8, paddingBottom: Platform.OS === 'ios' ? 12 : 8, minHeight: 40 },
    micButton: { padding: spacing.sm, marginRight: spacing.xs, marginBottom: 2 },
    sendButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
    sendButtonDisabled: { backgroundColor: colors.text.disabled }
});

export default ChatbotScreen;