import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { MainBackground } from '../../../components/MainBackground';
import { GlassCard } from '../../../components/GlassCard';
import { colors, spacing, typography, borderRadius } from '../../../core/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChatbotScreen = () => {
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello Farmer! I am your AI assistant. How can I help you today?', sender: 'ai' },
    ]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now().toString(), text: input, sender: 'user' }]);
        setInput('');
    };

    const renderMessage = ({ item }) => (
        <View style={[styles.messageWrapper, item.sender === 'user' ? styles.userRow : styles.aiRow]}>
            <GlassCard 
                style={[
                    styles.messageBubble, 
                    item.sender === 'user' ? styles.userBubble : styles.aiBubble
                ]}
                intensity={item.sender === 'ai' ? 60 : 20}
            >
                <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>
                    {item.text}
                </Text>
            </GlassCard>
        </View>
    );

    return (
        <MainBackground>
            <KeyboardAvoidingView 
                style={styles.container} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={100}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>AI Assistant</Text>
                </View>

                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.chatList}
                />

                <GlassCard style={styles.inputCard} intensity={80}>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ask an agricultural question..."
                            value={input}
                            onChangeText={setInput}
                            placeholderTextColor={colors.text.secondary}
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                            <MaterialCommunityIcons name="send" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </GlassCard>
            </KeyboardAvoidingView>
        </MainBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.l,
    },
    headerTitle: {
        ...typography.title,
        color: colors.text.primary,
    },
    chatList: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 20,
    },
    messageWrapper: {
        width: '100%',
        marginVertical: spacing.sm,
    },
    userRow: {
        alignItems: 'flex-end',
    },
    aiRow: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        borderRadius: borderRadius.lg,
    },
    userBubble: {
        backgroundColor: colors.glass.highlight,
    },
    aiBubble: {
        backgroundColor: 'rgba(46, 125, 50, 0.15)',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    userText: {
        ...typography.body,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    aiText: {
        ...typography.body,
        color: colors.primary,
        fontWeight: '600',
    },
    inputCard: {
        margin: spacing.lg,
        padding: 0,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: borderRadius.full,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        height: 60,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: colors.text.primary,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ChatbotScreen;
