import { BACKEND_URL } from './backend';

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'connected' | 'error' | 'reconnect';
  data?: any;
  userId?: string;
  chatId?: string;
  text?: string;
  timestamp?: number;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private userId: string;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isManualClose = false;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor(userId: string) {
    this.userId = userId;
    // Convert http/https to ws/wss and remove /api/v1 suffix if present
    let wsUrl = BACKEND_URL.replace(/^http/, 'ws').replace(/\/api\/v\d+$/, '');
    // Ensure no trailing slash
    wsUrl = wsUrl.replace(/\/$/, '');
    this.url = `${wsUrl}/chat`;
  }

  /**
   * Connect to WebSocket server
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isManualClose = false;
        console.log(`[WebSocket] Attempting to connect to: ${this.url}`);
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected successfully');
          this.reconnectAttempts = 0;
          
          // Send authentication message
          this.send({
            type: 'message',
            userId: this.userId,
            text: 'auth',
            timestamp: Date.now(),
          });

          // Start heartbeat
          this.startHeartbeat();
          
          // Notify handlers of connection
          this.notifyHandlers({
            type: 'connected',
            userId: this.userId,
            timestamp: Date.now(),
          });

          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.notifyHandlers(message);
          } catch (error) {
            console.error('[WebSocket] Failed to parse message:', error);
          }
        };

        this.ws.onerror = (event) => {
          console.error('[WebSocket] Connection error:', event);
          this.notifyHandlers({
            type: 'error',
            data: 'Connection error occurred',
            timestamp: Date.now(),
          });
          reject(event);
        };

        this.ws.onclose = () => {
          console.log('[WebSocket] Connection closed');
          this.stopHeartbeat();
          
          if (!this.isManualClose) {
            this.attemptReconnect();
          }
        };
      } catch (error) {
        console.error('[WebSocket] Failed to create connection:', error);
        reject(error);
      }
    });
  }

  /**
   * Send a message through WebSocket
   */
  public send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const fullMessage = {
        ...message,
        userId: this.userId,
        timestamp: Date.now(),
      };
      this.ws.send(JSON.stringify(fullMessage));
      console.log('[WebSocket] Message sent:', fullMessage.text || fullMessage.type);
    } else {
      const status = this.ws ? `readyState=${this.ws.readyState}` : 'ws=null';
      console.warn(`[WebSocket] Cannot send message - not connected (${status})`);
    }
  }

  /**
   * Send a chat message
   */
  public sendMessage(text: string, chatId?: string): void {
    this.send({
      type: 'message',
      text,
      chatId,
      userId: this.userId,
      timestamp: Date.now(),
    });
  }

  /**
   * Notify typing status
   */
  public sendTyping(chatId?: string): void {
    this.send({
      type: 'typing',
      chatId,
      userId: this.userId,
      timestamp: Date.now(),
    });
  }

  /**
   * Register a message handler
   */
  public onMessage(handler: (message: WebSocketMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  /**
   * Remove a message handler
   */
  public offMessage(handler: (message: WebSocketMessage) => void): void {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }

  /**
   * Notify all registered handlers
   */
  private notifyHandlers(message: WebSocketMessage): void {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  public disconnect(): void {
    this.isManualClose = true;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(
        `[WebSocket] Max reconnection attempts (${this.maxReconnectAttempts}) reached. Giving up.`
      );
      this.notifyHandlers({
        type: 'error',
        data: 'Failed to reconnect to server after maximum attempts',
        timestamp: Date.now(),
      });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(
      `[WebSocket] Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} ` +
      `in ${delay}ms (URL: ${this.url})`
    );
    
    setTimeout(() => {
      console.log(`[WebSocket] Starting reconnection attempt ${this.reconnectAttempts}...`);
      this.connect().catch((error) => {
        console.error(
          `[WebSocket] Reconnection attempt ${this.reconnectAttempts} failed:`,
          error.message || error
        );
      });
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({
          type: 'message',
          text: 'ping',
          userId: this.userId,
          timestamp: Date.now(),
        });
        console.log('[WebSocket] Heartbeat sent');
      } else {
        console.warn('[WebSocket] Heartbeat skipped - connection not ready');
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Get connection status
   */
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance for app-wide usage
let wsInstance: WebSocketManager | null = null;

export function initWebSocket(userId: string): WebSocketManager {
  if (!wsInstance) {
    wsInstance = new WebSocketManager(userId);
  }
  return wsInstance;
}

export function getWebSocket(): WebSocketManager | null {
  return wsInstance;
}

export function closeWebSocket(): void {
  if (wsInstance) {
    wsInstance.disconnect();
    wsInstance = null;
  }
}
