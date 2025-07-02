import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      
      login: async (email, password) => {
        // In a real app, this would call Supabase auth.signIn
        // For now, we'll simulate a successful login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set({
          user: {
            id: "1",
            name: "John Doe",
            email,
          },
          isAuthenticated: true,
          isGuest: false,
        });
      },
      
      signup: async (name, email, password) => {
        // In a real app, this would call Supabase auth.signUp
        // For now, we'll simulate a successful signup
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set({
          user: {
            id: "1",
            name,
            email,
          },
          isAuthenticated: true,
          isGuest: false,
        });
      },
      
      loginAsGuest: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set({
          user: null,
          isAuthenticated: false,
          isGuest: true,
        });
      },
      
      logout: async () => {
        // In a real app, this would call Supabase auth.signOut
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);