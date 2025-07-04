// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useEffect } from 'react';
import webSocketService from '../services/WebSocketService';

const WebSocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocket = () => useContext(WebSocketContext);

// eslint-disable-next-line react/prop-types
export const WebSocketProvider = ({ children }) => {
  useEffect(() => {
    webSocketService.connect();
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={webSocketService}>
      {children}
    </WebSocketContext.Provider>
  );
};
