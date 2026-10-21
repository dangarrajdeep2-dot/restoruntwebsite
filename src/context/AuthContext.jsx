import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Supabase
  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check local demo auth session
      const storedDemo = localStorage.getItem('nandanvan_demo_admin');
      if (storedDemo) {
        const demoUser = JSON.parse(storedDemo);
        setUser(demoUser);
        setProfile({
          id: demoUser.id,
          full_name: demoUser.full_name,
          role: demoUser.role,
        });
      }
      setLoading(false);
      return;
    }

    // Supabase auth subscription
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      // Demo authentication for local testing
      if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('owner') || password === 'admin123') {
        const demoAdmin = {
          id: 'demo-owner-id',
          email,
          full_name: 'Maharaj Digvijay (Owner)',
          role: 'owner',
        };
        localStorage.setItem('nandanvan_demo_admin', JSON.stringify(demoAdmin));
        setUser(demoAdmin);
        setProfile({
          id: demoAdmin.id,
          full_name: demoAdmin.full_name,
          role: demoAdmin.role,
        });
        return { data: { user: demoAdmin }, error: null };
      }
      return { data: null, error: new Error('Invalid demo credentials. Use owner@nandanvan.com / admin123') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data?.user) {
        await loadProfile(data.user.id);
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('nandanvan_demo_admin');
      setUser(null);
      setProfile(null);
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    return { error };
  };

  const isAdmin = profile?.role === 'owner' || profile?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        signIn,
        signOut,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
