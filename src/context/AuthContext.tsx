import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types';
import { toast } from 'react-hot-toast';

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
      
      // If we have a session but no user in state, or if it's a sign-in event, show loading
      if (session?.user && (!currentUser || _event === 'SIGNED_IN')) {
        setIsInitializing(true);
      }

      // Safety timeout for state changes
      const stateChangeGuard = setTimeout(() => {
        setIsInitializing(false);
      }, 4000);

      try {
        setCurrentUser(session?.user ?? null);
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!profileError) {
            setUserProfile(profileData);
          } else {
            console.error("Profile fetch error during state change:", profileError);
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error("Authentication state transition error:", err);
      } finally {
        clearTimeout(stateChangeGuard);
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
      setIsInitializing(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
      setUserProfile(null);
      toast.success('Signed out successfully');
    } catch (err: any) {
      console.error("Logout operation failed:", err);
      toast.error(err.message || "Failed to sign out");
    } finally {
      setIsInitializing(false);
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
