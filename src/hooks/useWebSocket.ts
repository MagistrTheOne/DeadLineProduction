"use client";

import { useEffect, useRef, useState } from "react";
import { createWebSocketClient } from "@/lib/ws/client";
import { useAuth } from "./useAuth";

export function useWebSocket(projectId?: string) {
  const { user } = useAuth();
  const [wsClient, setWsClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const client = createWebSocketClient(user.id, projectId);
    setWsClient(client);

    const handleOpen = () => setIsConnected(true);
    const handleClose = () => setIsConnected(false);

    client.on("connected", handleOpen);
    client.on("disconnected", handleClose);

    return () => {
      client.off("connected", handleOpen);
      client.off("disconnected", handleClose);
      client.disconnect();
    };
  }, [user?.id, projectId]);

  const send = (type: string, payload: any) => {
    if (wsClient) {
      wsClient.send(type, payload);
    }
  };

  const on = (type: string, listener: (data: any) => void) => {
    if (wsClient) {
      return wsClient.on(type, listener);
    }
    return () => {};
  };

  const off = (type: string, listener: (data: any) => void) => {
    if (wsClient) {
      wsClient.off(type, listener);
    }
  };

  return {
    send,
    on,
    off,
    isConnected,
  };
}

