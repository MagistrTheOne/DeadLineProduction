export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin" | "owner";
  subscription: "basic" | "pro" | "enterprise";
  createdAt: Date;
}

export interface Session {
  user: User;
  expiresAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}
