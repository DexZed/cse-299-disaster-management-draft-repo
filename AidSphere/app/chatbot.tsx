import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  streaming?: boolean;
}

export default function ChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your disaster assistant. Ask me anything about disaster preparedness and safety.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const WS_URL = "wss://cse-299-disaster-management-draft-repo.onrender.com/chat";

  // 🔌 Initialize WebSocket
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS Connected");
    };

    ws.onerror = (err) => {
      console.log("WS Error", err);
      Alert.alert("WebSocket Error", "Unable to connect to AI server.");
    };

    ws.onclose = () => {
      console.log("WS Closed");
    };

    // 🟦 Receive streaming data
    ws.onmessage = (raw) => {
      let data;
      try {
        data = JSON.parse(raw.data);
      } catch (e) {
        return;
      }

      // AI streaming chunk
      if (data.msg === "Ai Response Chunk") {
        setMessages((prev) => {
          const last = prev[prev.length - 1];

          // Append to current bot message
          if (last && last.sender === "bot" && last.streaming) {
            last.text += data.content;
            return [...prev];
          }

          // Create new bot message
          return [
            ...prev,
            {
              id: Date.now().toString(),
              sender: "bot",
              text: data.content,
              timestamp: new Date(),
              streaming: true,
            }
          ];
        });
      }

      // Streaming finished
      else if (data.msg === "Stream finished.") {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.streaming) last.streaming = false;
          return [...prev];
        });
        setLoading(false);
      }
    };

    return () => ws.close();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // 🟩 Send user message + request AI
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Send request to backend
    try {
      wsRef.current?.send(
        JSON.stringify({
          event: "generateText",
          messages: [{ role: "user", content: inputText }],
        })
      );
    } catch (err) {
      Alert.alert("Send Error", "Failed to communicate with the server.");
      return;
    }

    setLoading(true);
    setInputText('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
        ]}
      >
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.botMessageText]}>
            {item.text}
          </Text>
          <Text style={styles.timestamp}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <MaterialCommunityIcons name="chat-outline" size={24} color="#fff" />
          <Text style={styles.headerText}>Disaster Assistant</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
      />

      {/* Typing / Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#0099ff" size="small" />
          <Text style={styles.loadingText}>Assistant is typing...</Text>
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about disaster safety..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            disabled={!inputText.trim()}
            onPress={handleSendMessage}
          >
            <MaterialCommunityIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    backgroundColor: "#0099ff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },

  headerTitle: { flexDirection: "row", alignItems: "center", gap: 8 },

  headerText: { fontSize: 18, fontWeight: "700", color: "#fff" },

  messagesList: { paddingHorizontal: 12, paddingVertical: 12 },

  messageContainer: { marginVertical: 6, flexDirection: "row" },

  userMessageContainer: { justifyContent: "flex-end" },

  botMessageContainer: { justifyContent: "flex-start" },

  messageBubble: { maxWidth: "80%", padding: 12, borderRadius: 12 },

  userBubble: { backgroundColor: "#0099ff", borderBottomRightRadius: 4 },

  botBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  messageText: { fontSize: 14, lineHeight: 20 },

  userMessageText: { color: "#fff" },

  botMessageText: { color: "#333" },

  timestamp: { fontSize: 11, color: "#888", marginTop: 4 },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 8,
    backgroundColor: "#eee",
  },

  loadingText: { color: "#666", fontSize: 13 },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 120,
  },

  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: "#0099ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },

  sendButtonDisabled: { opacity: 0.5 },
});
