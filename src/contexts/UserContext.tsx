'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock user type to replace Supabase user
export interface MockUser {
  id: string;
  email: string;
  role: 'teacher' | 'student';
  user_metadata?: {
    full_name?: string;
    preferred_username?: string;
  };
}

// Mock auth data structure
export interface MockAuthData {
  user: MockUser | null;
}

interface UserContextType {
  user: MockUser | null;
  signIn: (username: string, password: string) => Promise<{ data: MockAuthData; error: any }>;
  signOut: () => Promise<void>;
  getUser: () => Promise<{ data: MockAuthData; error: any }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Test users that match backend test data
const TEST_USERS: { [key: string]: MockUser } = {
  'teacher1': {
    id: 'teacher1-uuid',
    email: 'teacher1@example.com',
    role: 'teacher',
    user_metadata: {
      full_name: 'Teacher One',
      preferred_username: 'teacher1'
    }
  },
  'teacher2': {
    id: 'teacher2-uuid',
    email: 'teacher2@example.com',
    role: 'teacher',
    user_metadata: {
      full_name: 'Teacher Two',
      preferred_username: 'teacher2'
    }
  },
  'student1': {
    id: 'student1-uuid',
    email: 'student1@example.com',
    role: 'student',
    user_metadata: {
      full_name: 'Student One',
      preferred_username: 'student1'
    }
  },
  'student2': {
    id: 'student2-uuid',
    email: 'student2@example.com',
    role: 'student',
    user_metadata: {
      full_name: 'Student Two',
      preferred_username: 'student2'
    }
  },
  'student3': {
    id: 'student3-uuid',
    email: 'student3@example.com',
    role: 'student',
    user_metadata: {
      full_name: 'Student Three',
      preferred_username: 'student3'
    }
  }
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('mockUser');
      }
    }
  }, []);

  const signIn = async (username: string, password: string): Promise<{ data: MockAuthData; error: any }> => {
    // Simple mock authentication - any password works for test users
    const mockUser = TEST_USERS[username.toLowerCase()];
    
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return { data: { user: mockUser }, error: null };
    } else {
      return { 
        data: { user: null }, 
        error: { message: 'Invalid username. Use: teacher1, teacher2, student1, student2, or student3' }
      };
    }
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  const getUser = async (): Promise<{ data: MockAuthData; error: any }> => {
    return { data: { user }, error: null };
  };

  const value: UserContextType = {
    user,
    signIn,
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

// Mock auth object to replace Supabase auth
export const mockAuth = {
  getUser: async (): Promise<{ data: MockAuthData; error: any }> => {
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        return { data: { user }, error: null };
      } catch (error) {
        return { data: { user: null }, error };
      }
    }
    return { data: { user: null }, error: null };
  }
};