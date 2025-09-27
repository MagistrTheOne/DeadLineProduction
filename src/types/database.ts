export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assigneeId?: string;
  projectId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: Date;
}

export interface AIInteraction {
  id: string;
  agentType: string;
  prompt: string;
  response?: string;
  userId?: string;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: "basic" | "pro" | "enterprise";
  status: "active" | "past_due" | "canceled";
  expiresAt?: Date;
}
