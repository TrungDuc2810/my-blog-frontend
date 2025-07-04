import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  connect(onConnect) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      debug: (str) => {
        console.log("Websocket: ", new Date(), str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        console.log("Websocket connected!");
        if (onConnect) {
          onConnect();
        }
      },
      onDisconnect: () => {
        this.connected = false;
        console.log("Websocket disconnected!");
      },
      onStompError: (frame) => {
        console.error("Websocket errored" + frame);
      },
    });
    this.client.activate();
  }
  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }
  subscribe(destination, callback) {
    if (!this.connected || !this.client) {
      console.error("Websocket is not connected!");
      return null;
    }
    return this.client.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error("Error parsing message body:", error);
      }
    });
  }
  send(destination, body) {
    if (!this.connected || !this.client) {
      console.error("Websocket is not connected!");
      return;
    }
    this.client.publish({
      destination: destination,
      body: JSON.stringify(body),
    });
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
