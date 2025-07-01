'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface SupabaseUser extends User {
  // Extend with any additional properties if needed
}

// Auth data structure matching Supabase
export interface AuthData {
  user: SupabaseUser | null;
}

interface UserContextType {
  user: SupabaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  getUser: () => Promise<{ data: AuthData; error: any }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Load user session on mount and listen for auth changes
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signInWithGoogle = async (): Promise<{ data: any; error: any }> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      return { data, error };
    } catch (err) {
      return { 
        data: null, 
        error: { message: 'Failed to sign in with Google' }
      };
    }
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const getUser = async (): Promise<{ data: AuthData; error: any }> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { data: { user }, error };
    } catch (error) {
      return { data: { user: null }, error };
    }
  };

  const value: UserContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    getUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Keep compatibility with existing code that uses mockAuth
export const mockAuth = {
  getUser: async (): Promise<{ data: AuthData; error: any }> => {
    const supabase = createClient();
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { data: { user }, error };
    } catch (error) {
      return { data: { user: null }, error };
    }
  }
};