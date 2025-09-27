"use client";

import { useEffect, useRef } from "react";
import { getWebSocketClient } from "@/lib/ws/client";

export function useWebSocket() {
  const wsClient = useRef(getWebSocketClient());

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      wsClient.current.disconnect();
    };
  }, []);

  const send = (type: string, payload: any) => {
    wsClient.current.send(type, payload);
  };

  const on = (type: string, listener: (data: any) => void) => {
    return wsClient.current.on(type, listener);
  };

  const off = (type: string, listener: (data: any) => void) => {
    wsClient.current.off(type, listener);
  };

  const isConnected = () => {
    return wsClient.current.isConnected();
  };

  return {
    send,
    on,
    off,
    isConnected,
  };
}

