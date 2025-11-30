import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, TextInput, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Volunteer X',
      text: 'Hello! I am on my way to help you.',
      timestamp: '10:30 AM',
      isSent: false,
    },
    {
      id: '2',
      sender: 'You',
      text: 'Thank you so much!',
      timestamp: '10:32 AM',
      isSent: true,
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: String(messages.length + 1),
        sender: 'You',
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: true,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat with Volunteer</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.isSent ? styles.sentContainer : styles.receivedContainer,
            ]}>
            <View
              style={[
                styles.messageBubble,
                item.isSent ? styles.sentBubble : styles.receivedBubble,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  item.isSent ? styles.sentText : styles.receivedText,
                ]}>
                {item.text}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  item.isSent ? styles.sentTimestamp : styles.receivedTimestamp,
                ]}>
                {item.timestamp}
              </Text>
            </View>
          </View>
        )}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <MaterialCommunityIcons name="send" size={20} color="#0099ff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  messagesContent: {
    paddingVertical: 12,
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  sentContainer: {
    justifyContent: 'flex-end',
  },
  receivedContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sentBubble: {
    backgroundColor: '#0099ff',
  },
  receivedBubble: {
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#222',
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.7,
  },
  sentTimestamp: {
    color: '#fff',
  },
  receivedTimestamp: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#222',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
