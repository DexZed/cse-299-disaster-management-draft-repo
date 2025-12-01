import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your disaster assistant. I can help answer questions about disaster preparedness, safety, and emergency resources. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Disaster-related keywords and responses
    const disasterResponses: { [key: string]: string[] } = {
      earthquake: [
        'During an earthquake: DROP, COVER, and HOLD ON. Drop to your hands and knees, take cover under a sturdy desk/table, and hold on until shaking stops. Stay away from windows and heavy objects that could fall.',
        'After an earthquake: Check for injuries, inspect your home for damage, turn off gas if you smell it, and listen to emergency broadcasts. Be prepared for aftershocks.',
      ],
      flood: [
        'Before a flood: Know evacuation routes, have supplies ready, and understand your area\'s flood risk. Never drive through flooded roads - turn around!',
        'During a flood: Move to higher ground immediately. Keep away from power lines and floodwaters. Stay tuned to emergency broadcasts for updates.',
      ],
      hurricane: [
        'Hurricane preparation: Board up windows, secure outdoor items, fill bathtubs with water, stock food/water for 1 week, and have a family communication plan.',
        'During a hurricane: Stay indoors, away from windows. Go to an interior room on the lowest floor. Keep emergency supplies nearby.',
      ],
      tornado: [
        'Tornado warning: Go to a basement or interior room away from windows. If outdoors, lie flat in a ditch. Cover your head and neck.',
        'Tornado safety: Identify safe shelters in advance. Monitor weather alerts. Never try to outrun a tornado.',
      ],
      wildfire: [
        'Wildfire preparation: Create a 30-foot clearance around your home, use fire-resistant materials, have an evacuation kit ready with important documents.',
        'Wildfire evacuation: Leave immediately if ordered. Close windows/doors, wear protective clothing, and follow evacuation routes.',
      ],
      first_aid: [
        'Basic first aid: For cuts, apply pressure with clean cloth. For burns, run cool water for 10+ minutes. For choking, perform the Heimlich maneuver. Call emergency services for serious injuries.',
        'Always call 911 for medical emergencies. Cardiopulmonary resuscitation (CPR) can be lifesaving - consider taking a certified course.',
      ],
      shelter: [
        'Emergency shelter options: Public shelters, community centers, schools, or staying with friends/family. Check local resources for available shelters during disasters.',
        'Shelter essentials: Bring important documents, medications, comfort items, and supplies. Follow shelter rules and cooperate with staff.',
      ],
      supplies: [
        'Emergency kit essentials: Water (1 gallon/person/day for 3 days), non-perishable food, first aid kit, flashlight, batteries, medications, documents, and cash.',
        'Extended kit: Include a battery/hand-crank radio, multi-tool, duct tape, plastic sheeting, moist towelettes, garbage bags, and a wrench to turn off utilities.',
      ],
      water: [
        'Water safety in disasters: Store 1 gallon per person per day for at least 3 days. Boil water if advised, or use bottled water. Don\'t use tap water if contaminated.',
        'Water purification: Boiling, bleach (8 drops per gallon), or purification tablets work. Store water in food-grade containers away from chemicals.',
      ],
      evacuation: [
        'Evacuation planning: Know multiple routes out of your area. Have a family meeting point. Practice the route. Keep your vehicle fueled.',
        'During evacuation: Leave early if possible. Take essential documents, medications, and valuables. Lock doors and turn off utilities if time allows.',
      ],
      family_plan: [
        'Create a family disaster plan: Discuss potential disasters, establish meeting points, learn utility shutoffs, exchange out-of-state contact info, and practice together.',
        'Family communication: Keep emergency contacts visible. Consider a code word for safety. Teach children their address/phone. Update plans annually.',
      ],
    };

    // Convert user message to lowercase and search for keywords
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [keyword, responses] of Object.entries(disasterResponses)) {
      if (lowerMessage.includes(keyword)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Default response for unknown queries
    const defaultResponses = [
      'Great question! I can help with information about earthquake safety, floods, hurricanes, tornadoes, wildfires, first aid, shelters, emergency supplies, evacuation plans, and family disaster planning. What topic interests you?',
      'I\'m here to help with disaster preparedness! Ask me about specific disasters, emergency supplies, evacuation procedures, or safety tips.',
      'That\'s an important question. I specialize in disaster-related information. Feel free to ask about natural disasters, emergency preparedness, or safety measures.',
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    // Simulate API delay
    setTimeout(async () => {
      const botResponse = await generateBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.botMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.botTimestamp]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" />
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
        scrollEnabled={true}
      />

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#0099ff" size="small" />
          <Text style={styles.loadingText}>Assistant is typing...</Text>
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about disaster safety..."
            placeholderTextColor="#aaa"
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || loading}
          >
            <MaterialCommunityIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0099ff',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  messageContainer: {
    marginVertical: 6,
    flexDirection: 'row',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#0099ff',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  botTimestamp: {
    color: '#999',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    fontSize: 13,
    color: '#666',
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0099ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#99ccff',
    opacity: 0.6,
  },
});
