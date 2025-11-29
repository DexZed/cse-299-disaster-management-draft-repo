
# Disaster Management API (NestJS)

Backend server for the **CSE-299 Disaster Management System.**
Provides REST endpoints for **Users**, **Resources**, and **AI Chat**, along with **WebSocket-based LLM streaming**.

## Route Prefix
All routes are prefixed with:

```bash
/api/v1
```

When hosted on Render:

```bash
https://cse-299-disaster-management-draft-repo.onrender.com/api/v1

```

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/cse-299-disaster-management-draft-repo
cd cse-299-disaster-management-draft-repo/server-side

```
### 2. Install dependencies
```bash
npm install
```
### 3. Environment Variables dependencies

Create a .env file in the root of server-side:

```bash
PORT=3000
MONGO_DB_URL=YOUR_MONGO_CONNECTION_STRING
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

```

### 4. Run the server

Development:
```bash
npm run start:dev

```
Production:
```bash
npm run build
npm run start:prod
```
The server will start at:
```bash
http://localhost:3000/api/v1
```

# 🧭 Global Configuration

From **main.ts**:

- Global prefix: `/api/v1`

- CORS enabled

- Port uses env or defaults to `3000`
## API Reference

### 👤 USERS MODULE
#### Create User
```http
  POST /users
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `User DTO` | ` JSON object` | Create user                |

#### Get User

```http
  GET /users
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `None`     | `None` | Get all users  |

#### Get User

```http
  GET /users/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`     | `string (Mongo DB BSON)` | Get Single user  |


#### Update User

```http
  PATCH /users/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`     | `string (Mongo DB BSON)` | Update user  |

#### Delete User

```http
  Delete /users/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`     | `string (Mongo DB BSON)` | Remove User  |

##### User Interface

```typescript
name: string
email: string (valid email)
password: string (min 8, must contain uppercase, number, special char)
role: 'admin' | 'user' | 'affected' | 'volunteer'
```
##### Update User Interface
```typescript
name?: string
email?: string (valid email)
password?: string (min 8, must contain uppercase, number, special char)
role?: 'admin' | 'user' | 'affected' | 'volunteer'
```
##### Passwword Rule
```typescript
At least 1 uppercase letter
At least 1 digit
At least 1 special character
Min length: 8

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/;
```
##### Example Response: GET /users

```json
{
  "data": [
    {
      "_id": "65ab12f8a9",
      "name": "John Doe",
      "email": "john@mail.com",
      "role": "volunteer"
    }
  ]
}
```



### 📦 RESOURCES MODULE
#### Create Resource
```http
  POST /resources
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Resource Interface` | ` JSON object` | Create Resource               |

#### Get all Resources

```http
  GET /resources
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `None`     | `None` | Get all Resources  |

#### Get Resource

```http
  GET /resources/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`     | `string (Mongo DB BSON)` | Get single resource  |


#### Update Resource

```http
  PATCH /resources/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`     | `string (Mongo DB BSON)` | Update Resource  |

#### Delete Resource

```http
  Delete /resources/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`     | `string (Mongo DB BSON)` | Remove Resource  |

##### Resource Interface

```typescript
name: string
description?: string
quantity: number
status: 'In-Use' | 'Assigned' | 'Out of Stock' | 'Available'
location: string
expiryDate?: Date
```
##### Update Resource Interface
```typescript
name?: string
description?: string
quantity?: number
status?: 'In-Use' | 'Assigned' | 'Out of Stock' | 'Available'
location?: string
expiryDate?: Date
```

##### Example  Response: GET /resources all

```json
{
  "data": [
    {
        "_id":"655f4a7b9e7c8d1f2a3b4c5d"
      "name": "Food",
      "description": "Food Supply",
      "quantity": "20",
      "status": "In-Use",
      "location":"1234, avenue, city",
      "expiryDate":"YYYY-mm-ddTHH:MM:ss.sss"
    },
    {
    "_id":"655f4a7b9e7c8d1f2a3b4c5d"
      "name": "Food",
      "description": "Food Supply",
      "quantity": "20",
      "status": "In-Use",
      "location":"1234, avenue, city",
      "expiryDate":"YYYY-mm-ddTHH:MM:ss.sss"
    }
  ]
}
```

### 🤖 CHAT MODULE (WebSockets)
#### ⚡ WebSocket — AI Streaming
NameSpace
```http
  /chat
```
Socket URL when hosted:
```http
wss://cse-299-disaster-management-draft-repo.onrender.com/chat

```

##### Events

| Event Name     | Payload DTO             | Description             |
| -------------- | ----------------------- | ----------------------- |
| `message`      | any                     | Basic echo-like handler to check for ws connection is working or not.|
| `generateText` | Chat Completion Interface | Full LLM streaming      |
| `appAssistant` | Chat Completion  Interface| ⚠️ *Incomplete feature* |


##### Chat Completion Interface

```typescript
  messages: [
      {
    role: 'user' | 'model'
    content: string
    }
]
     
```
##### Streaming Behavior

When generateText is called:

- Server streams chunks back to the same client via:
```csharp
onMessage   (chunk-by-chunk)
streamComplete (final event)
```

##### Example stream message:

```json
{
  "msg": "Ai Response Chunk",
  "content": "Hello, how can I assist..."
}
```

##### Completion signal:

```json
{
  "msg": "Stream finished."
}
```
## 📱 Frontend Usage

### Base URL

Local:
```typescript
export const API_URL = "http://10.0.2.2:3000/api/v1";
```

Hosted:
```typecript
export const API_URL = "https://cse-299-disaster-management-draft-repo.onrender.com/api/v1"
```

## 📡 REST API Calls (Expo Example)

### 1. Generic API Client
#### src/core/api.ts
```typescript
export const API_URL = "https://cse-299-disaster-management-draft-repo.onrender.com/api/v1";

export async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

```

Hosted:
```ts
export const API_URL = "https://cse-299-disaster-management-draft-repo.onrender.com/api/v1"
```

### 👤 Example — Create User

#### src/core/UserService.ts 
```ts
import { api } from "./api";

export function createUser(data) {
  return api("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
```

##### Example component
```ts
const create = async () => {
  try {
    await createUser({
      name,
      email,
      password,
      role: "user"
    });
  } catch (err) {
    console.log(err);
  }
};
```

##### 📦 Example — Fetch Resources
```ts
export function getResources() {
  return api("/resources");
}
```
### ⚡ WebSocket Usage (Expo)

Install socket.io client:
```bash
npm install socket.io-client
```

##### Example:
```ts
import { io } from "socket.io-client";

const socket = io("https://cse-299-disaster-management-draft-repo.onrender.com/chat", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.emit("generateText", {
  messages: [{ role: "user", content: "Hello AI" }]
});

socket.on("onMessage", (msg) => {
  console.log("Chunk:", msg);
});

socket.on("streamComplete", () => {
  console.log("Stream finished.");
});
```

## 🧠 Frontend AI Chat — Conversation, Chunk Handling & Hooks
### 📄 Message Interfaces
```ts
// Single message (client-side → server)
export interface ChatMessage {
  role: "user" | "model";   // Nest-side uses "model" instead of "assistant"
  content: string;
}

// The conversation history
export type ChatHistory = ChatMessage[];

```
Every time you send a prompt, you must include **all previous messages**, including model replies.

Example conversation:

```ts
const conversation: ChatHistory = [
  { role: "user", content: "Hello" },
  { role: "model", content: "Hi there! How can I help?" },
  { role: "user", content: "Tell me about storms." }
];
```
On **generateText**, you will send:

```ts
socket.emit("generateText", {
  messages: conversation
});
```

### ⚡ Handling Streaming Chunks
Backend sends streaming chunks via:

```css

onMessage → { msg: "Ai Response Chunk", content: chunk }
streamComplete → { msg: "Stream finished." }
```

You must accumulate chunks:

```ts

let buffer = "";

socket.on("onMessage", (payload) => {
  if (payload.msg === "Ai Response Chunk") {
    buffer += payload.content;
  }
});
```
After **streamComplete**, append the final model message:

```ts

socket.on("streamComplete", () => {
  const fullModelMessage: ChatMessage = {
    role: "model",
    content: buffer,
  };

  setConversation((prev) => [...prev, fullModelMessage]);
  buffer = ""; // reset for next generation
});
```

### 🪝 Safe React Hook for Chat (Expo React Native)
This hook:

- Ensures socket is created only once

- Automatically registers/unregisters listeners

- Avoids stale closures

- Safely accumulates chunks

- Returns: conversation, sendMessage(), loading flag, and last response


## 📌 `useChatLLM.ts`
### ⚠️Caution - this is an example usage and may not work if copy pasted. Please be aware   
```ts

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { ChatHistory, ChatMessage } from "./types";

export function useChatLLM() {
  const [conversation, setConversation] = useState<ChatHistory>([]);
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const bufferRef = useRef(""); // safe across renders

  // INIT SOCKET ONCE
  useEffect(() => {
    const socket = io(
      "https://cse-299-disaster-management-draft-repo.onrender.com/chat",
      { transports: ["websocket"] }
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    // CHUNK LISTENER
    socket.on("onMessage", (payload) => {
      if (payload.msg === "Ai Response Chunk") {
        bufferRef.current += payload.content;
        setLastResponse(bufferRef.current); // live preview of stream
      }
    });

    // STREAM COMPLETE
    socket.on("streamComplete", () => {
      const fullModelMessage: ChatMessage = {
        role: "model",
        content: bufferRef.current,
      };

      setConversation((prev) => [...prev, fullModelMessage]);
      bufferRef.current = "";
      setLoading(false);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  // SEND USER MESSAGE + REQUEST STREAM
  const sendMessage = useCallback((text: string) => {
    if (!socketRef.current) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: text,
    };

    setConversation((prev) => {
      const updated = [...prev, userMessage];

      socketRef.current!.emit("generateText", {
        messages: updated, // full history
      });

      return updated;
    });

    setLoading(true);
    setLastResponse("");
    bufferRef.current = "";
  }, []);

  return {
    conversation,
    sendMessage,
    loading,
    lastResponse, // live streamed content
  };
}
```
### 🗣️ Example Component — AI Chat UI
```ts

import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { useChatLLM } from "./useChatLLM";

export default function ChatScreen() {
  const { conversation, sendMessage, loading, lastResponse } = useChatLLM();
  const [input, setInput] = useState("");

  const onSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView style={{ flex: 1 }}>
        {conversation.map((msg, i) => (
          <Text key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: "bold" }}>{msg.role}: </Text>
            {msg.content}
          </Text>
        ))}

        {/* Streaming preview */}
        {loading && !!lastResponse && (
          <Text style={{ color: "blue" }}>
            model (streaming): {lastResponse}
          </Text>
        )}
      </ScrollView>

      <TextInput
        placeholder="Type your message..."
        value={input}
        onChangeText={setInput}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
        }}
      />

      <Button title={loading ? "Thinking..." : "Send"} onPress={onSend} />
    </View>
  );
}
```



### Incomplete Features
#### appAssistant Socket Event

***⚠️ Incomplete ***.

In README:
```csharp
⚠️ The "appAssistant" WebSocket event is not fully implemented.  
It accepts messages but still needs complete logic in chatService.
```
### 🌍 Deployment Note

When deploying to Render:

- Your server URL will be something like:
```http
https://cse-299-disaster-management-draft-repo.onrender.com
```

- REST endpoints automatically become:
```http
https://cse-299-disaster-management-draft-repo.onrender.com/api/v1/users
https://cse-299-disaster-management-draft-repo.onrender.com/api/v1/resources

```

- WebSocket namespace:
```http
wss://cse-299-disaster-management-draft-repo.onrender.com/chat
```