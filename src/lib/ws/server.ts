import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { parse } from "url";

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  projectId?: string;
}

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, AuthenticatedWebSocket> = new Map();
  private projectRooms: Map<string, Set<string>> = new Map();

  initialize(server: any) {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws: AuthenticatedWebSocket, req: IncomingMessage) => {
      const url = parse(req.url || "", true);
      const userId = url.query.userId as string;
      const projectId = url.query.projectId as string;

      if (!userId) {
        ws.close(1008, "Authentication required");
        return;
      }

      ws.userId = userId;
      ws.projectId = projectId;
      this.clients.set(userId, ws);

      if (projectId) {
        this.joinProject(userId, projectId);
      }

      console.log(`WebSocket connected: User ${userId}, Project ${projectId}`);

      ws.on("message", (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      });

      ws.on("close", () => {
        this.leaveProject(userId, projectId);
        this.clients.delete(userId);
        console.log(`WebSocket disconnected: User ${userId}`);
      });

      ws.on("error", (error) => {
        console.error(`WebSocket error for user ${userId}:`, error);
      });
    });
  }

  private handleMessage(ws: AuthenticatedWebSocket, message: WebSocketMessage) {
    switch (message.type) {
      case "join.project":
        if (message.payload.projectId) {
          this.joinProject(ws.userId!, message.payload.projectId);
        }
        break;
      
      case "leave.project":
        if (message.payload.projectId) {
          this.leaveProject(ws.userId!, message.payload.projectId);
        }
        break;
      
      case "task.moved":
        this.broadcastToProject(ws.projectId!, {
          type: "task.updated",
          payload: message.payload,
        });
        break;
      
      case "task.created":
        this.broadcastToProject(ws.projectId!, {
          type: "task.created",
          payload: message.payload,
        });
        break;
      
      case "task.deleted":
        this.broadcastToProject(ws.projectId!, {
          type: "task.deleted",
          payload: message.payload,
        });
        break;
      
      case "comment.created":
        this.broadcastToProject(ws.projectId!, {
          type: "comment.created",
          payload: message.payload,
        });
        break;
      
      case "chat.message":
        this.broadcastToProject(ws.projectId!, {
          type: "chat.message",
          payload: message.payload,
        });
        break;
      
      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  private joinProject(userId: string, projectId: string) {
    if (!this.projectRooms.has(projectId)) {
      this.projectRooms.set(projectId, new Set());
    }
    this.projectRooms.get(projectId)!.add(userId);
    console.log(`User ${userId} joined project ${projectId}`);
  }

  private leaveProject(userId: string, projectId: string) {
    if (projectId && this.projectRooms.has(projectId)) {
      this.projectRooms.get(projectId)!.delete(userId);
      console.log(`User ${userId} left project ${projectId}`);
    }
  }

  private broadcastToProject(projectId: string, message: WebSocketMessage) {
    const room = this.projectRooms.get(projectId);
    if (!room) return;

    const messageStr = JSON.stringify(message);
    
    room.forEach(userId => {
      const client = this.clients.get(userId);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  public broadcastToUser(userId: string, message: WebSocketMessage) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  public broadcastToProject(projectId: string, message: WebSocketMessage) {
    this.broadcastToProject(projectId, message);
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.clients.keys());
  }

  public getProjectUsers(projectId: string): string[] {
    const room = this.projectRooms.get(projectId);
    return room ? Array.from(room) : [];
  }
}

// Singleton instance
export const wsManager = new WebSocketManager();

// Initialize WebSocket server
export function initializeWebSocketServer(server: any) {
  wsManager.initialize(server);
  return wsManager;
}
