import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signInAsDevAdmin: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchRoleByEmail = async (email: string): Promise<string> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user role:', error.message);
    return 'viewer';
  }

  return (data as { role: string } | null)?.role ?? 'viewer';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    if (typeof window === 'undefined') return;

    try {
      const hash = window.location.hash || '';
      if (hash.includes('access_token=')) {
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      const {
        data: { session: currentSession }
      } = await supabase.auth.getSession();

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user?.email) {
        const currentRole = await fetchRoleByEmail(currentSession.user.email);
        setRole(currentRole);
      } else {
        setRole(null);
      }

      if (hash.includes('access_token=')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch (error) {
      console.error('Error initializing auth session:', error);
      setUser(null);
      setSession(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user?.email) {
        const currentRole = await fetchRoleByEmail(currentSession.user.email);
        setRole(currentRole);
      } else {
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    // Use the simple /callback route to match a standard OAuth redirect flow.
    // Supabase site URL must still be the app origin: http://localhost:5173
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback`
      }
    });

    if (error) {
      throw error;
    }
  };

  const signInAsDevAdmin = async () => {
    const devUser = {
      id: 'dev-admin',
      email: 'admin@localhost'
    } as User;

    setUser(devUser);
    setRole('admin');
    setSession(null);
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
      if (data.session.user?.email) {
        const currentRole = await fetchRoleByEmail(data.session.user.email);
        setRole(currentRole);
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, role, loading, signInWithGoogle, signInWithPassword, signInAsDevAdmin, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
