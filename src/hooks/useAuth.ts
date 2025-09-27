"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "owner";
  subscription: "basic" | "pro" | "enterprise";
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const user = await response.json();
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        setAuthState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true,
        });
        router.push("/dashboard");
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        setAuthState({
          user: result.user,
          isLoading: false,
          isAuthenticated: true,
        });
        router.push("/dashboard");
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: "Registration failed" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    checkAuth,
  };
}
