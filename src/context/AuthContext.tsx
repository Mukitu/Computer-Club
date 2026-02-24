import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Failsafe mechanism to prevent infinite loading states
    const initializationGuard = setTimeout(() => {
      if (isInitializing) {
        console.warn("Authentication handshake timed out - proceeding with default state");
        setIsInitializing(false);
      }
    }, 3500);

    const synchronizeAuthenticationState = async () => {
      if (!isSupabaseConfigured()) {
        setIsInitializing(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!profileError) setUserProfile(profileData);
        }
      } catch (err) {
        console.error("Critical authentication failure:", err);
      } finally {
        setIsInitializing(false);
        clearTimeout(initializationGuard);
      }
    };

    synchronizeAuthenticationState();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isSupabaseConfigured()) return;
      
      try {
        setCurrentUser(session?.user ?? null);
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (!profileError) setUserProfile(profileData);
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error("Authentication state transition error:", err);
      } finally {
        setIsInitializing(false);
      }
    });

    return () => {
      authSubscription.unsubscribe();
      clearTimeout(initializationGuard);
    };
  }, []);

  const terminateSession = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout operation failed:", err);
    }
  };

  const contextValue: AuthContextType = {
    user: currentUser,
    profile: userProfile,
    loading: isInitializing,
    signOut: terminateSession
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
