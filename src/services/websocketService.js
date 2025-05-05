// WebSocket service for connecting to the Docker/Python backend
import { EventEmitter } from 'events';

// WebSocket states for reference
const WS_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};

class WebSocketService extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.connected = false;
    this.reconnectTimer = null;
    this.reconnectInterval = 5000; // 5 seconds
    this.url = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000/ws';
  }

  connect() {
    if (this.socket && (this.socket.readyState === WS_STATES.CONNECTING || 
                        this.socket.readyState === WS_STATES.OPEN)) {
      console.log('WebSocket already connected or connecting');
      return; // Already connected or connecting
    }

    // Clear any existing socket
    if (this.socket) {
      try {
        this.socket.close();
      } catch (e) {
        console.error('Error closing existing socket:', e);
      }
      this.socket = null;
    }

    console.log(`Connecting to WebSocket at ${this.url}`);
    
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.connected = true;
        this.emit('connection-status', { connected: true });
        clearTimeout(this.reconnectTimer);
        
        // Only send ping if socket is connected
        if (this.socket && this.socket.readyState === WS_STATES.OPEN) {
          try {
            this.socket.send(JSON.stringify({ type: 'ping' }));
          } catch (error) {
            console.error('Error sending ping:', error);
          }
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          // Check if the message contains air quality data
          if (message.data && Array.isArray(message.data)) {
            console.log('Received air quality update:', message.timestamp);
            this.emit('air-quality-update', message.data);
          } else {
            // Handle other message types if needed
            console.log('Received other message:', message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        this.connected = false;
        this.socket = null;
        this.emit('connection-status', { 
          connected: false, 
          error: 'websocket disconnected'
        });
        
        // Attempt to reconnect
        this.reconnectTimer = setTimeout(() => {
          console.log('Attempting to reconnect...');
          this.connect();
        }, this.reconnectInterval);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('connection-status', { 
          connected: false, 
          error: 'websocket error'
        });
      };
    } catch (e) {
      console.error('Error initializing WebSocket:', e);
      // Schedule reconnect
      this.reconnectTimer = setTimeout(() => {
        console.log('Attempting to reconnect after initialization error...');
        this.connect();
      }, this.reconnectInterval);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
      clearTimeout(this.reconnectTimer);
    }
  }

  // Send a message to the server (if needed)
  sendMessage(messageType, data) {
    if (this.socket && this.socket.readyState === WS_STATES.OPEN) {
      try {
        const message = {
          type: messageType,
          ...data
        };
        this.socket.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Error sending message:', error);
        return false;
      }
    }
    return false;
  }

  // Request a data update from the server
  requestDataUpdate() {
    return this.sendMessage('request-data-update', { timestamp: new Date().toISOString() });
  }

  // Add event listener
  addListener(event, callback) {
    return super.addListener(event, callback);
  }

  // Remove event listener
  removeListener(event, callback) {
    return super.removeListener(event, callback);
  }

  // Check if currently connected
  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 