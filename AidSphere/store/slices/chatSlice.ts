import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'volunteer';
  timestamp: number;
  userId?: string;
  chatId?: string;
  read?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ChatState {
  chats: { [key: string]: Chat };
  currentChatId: string | null;
  loading: boolean;
  error: string | null;
  isWebSocketConnected: boolean;
  typingUsers: string[];
}

const initialState: ChatState = {
  chats: {},
  currentChatId: null,
  loading: false,
  error: null,
  isWebSocketConnected: false,
  typingUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Chat management
    createChat: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const { id, title } = action.payload;
      state.chats[id] = {
        id,
        title,
        messages: [],
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      state.currentChatId = id;
    },

    setCurrentChat: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    },

    // Message management
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const message = action.payload;
      if (state.currentChatId && state.chats[state.currentChatId]) {
        state.chats[state.currentChatId].messages.push(message);
        state.chats[state.currentChatId].updatedAt = Date.now();
      }
    },

    addMultipleMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      if (state.currentChatId && state.chats[state.currentChatId]) {
        state.chats[state.currentChatId].messages.push(...action.payload);
        state.chats[state.currentChatId].updatedAt = Date.now();
      }
    },

    removeMessage: (state, action: PayloadAction<string>) => {
      if (state.currentChatId && state.chats[state.currentChatId]) {
        const messages = state.chats[state.currentChatId].messages;
        const index = messages.findIndex((msg) => msg.id === action.payload);
        if (index !== -1) {
          messages.splice(index, 1);
        }
      }
    },

    clearMessages: (state) => {
      if (state.currentChatId && state.chats[state.currentChatId]) {
        state.chats[state.currentChatId].messages = [];
      }
    },

    // WebSocket connection status
    setWebSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.isWebSocketConnected = action.payload;
    },

    // Typing indicators
    addTypingUser: (state, action: PayloadAction<string>) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },

    removeTypingUser: (state, action: PayloadAction<string>) => {
      state.typingUsers = state.typingUsers.filter((userId) => userId !== action.payload);
    },

    clearTypingUsers: (state) => {
      state.typingUsers = [];
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Reset
    resetChat: (state) => {
      state.chats = {};
      state.currentChatId = null;
      state.loading = false;
      state.error = null;
      state.typingUsers = [];
    },
  },
});

export const {
  createChat,
  setCurrentChat,
  addMessage,
  addMultipleMessages,
  removeMessage,
  clearMessages,
  setWebSocketConnected,
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
  setLoading,
  setError,
  resetChat,
} = chatSlice.actions;

// Selectors
export const selectChats = (state: { chat: ChatState }) => state.chat.chats;
export const selectCurrentChatId = (state: { chat: ChatState }) => state.chat.currentChatId;
export const selectCurrentChat = (state: { chat: ChatState }) => {
  const chatId = state.chat.currentChatId;
  return chatId ? state.chat.chats[chatId] : null;
};
export const selectCurrentChatMessages = (state: { chat: ChatState }) => {
  const chatId = state.chat.currentChatId;
  return chatId ? state.chat.chats[chatId]?.messages || [] : [];
};
export const selectWebSocketConnected = (state: { chat: ChatState }) => state.chat.isWebSocketConnected;
export const selectTypingUsers = (state: { chat: ChatState }) => state.chat.typingUsers;
export const selectChatLoading = (state: { chat: ChatState }) => state.chat.loading;
export const selectChatError = (state: { chat: ChatState }) => state.chat.error;

export default chatSlice.reducer;
