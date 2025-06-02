"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseDashboard } from '@/lib/supabase/clients';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    
    // Listener para mudanças de auth
    const { data: { subscription } } = supabaseDashboard.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const newUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
          };
          setUser(newUser);
          localStorage.setItem('userProfile', JSON.stringify(newUser));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('userProfile');
          localStorage.removeItem('multiparkSelectedPark');
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { user: currentUser } } = await supabaseDashboard.auth.getUser();
      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabaseDashboard.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error || !data.user) {
        console.error('Sign in error:', error);
        return false;
      }
      
      const newUser: User = {
        id: data.user.id,
        email: data.user.email || '',
        full_name: data.user.user_metadata?.full_name || email.split('@')[0]
      };
      
      setUser(newUser);
      localStorage.setItem('userProfile', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabaseDashboard.auth.signOut();
      setUser(null);
      localStorage.removeItem('userProfile');
      localStorage.removeItem('multiparkSelectedPark');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
