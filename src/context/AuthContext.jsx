import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authenticateStaff } from '../api/staff';

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
    // 1. Check local staff auth session
    const storedStaff = localStorage.getItem('nandanvan_active_staff');
    if (storedStaff) {
      try {
        const staffUser = JSON.parse(storedStaff);
        setUser(staffUser);
        setProfile({
          id: staffUser.id,
          full_name: staffUser.full_name,
          role: staffUser.role,
          email: staffUser.email,
        });
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem('nandanvan_active_staff');
      }
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 2. Supabase auth subscription
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

  const signIn = async (emailOrUsername, password) => {
    // First try local staff registry (handles admin, waiter, cook)
    const { data: staffData, error: staffError } = await authenticateStaff(emailOrUsername, password);
    if (staffData) {
      localStorage.setItem('nandanvan_active_staff', JSON.stringify(staffData));
      setUser(staffData);
      setProfile({
        id: staffData.id,
        full_name: staffData.full_name,
        role: staffData.role,
        email: staffData.email,
      });
      return { data: { user: staffData }, error: null };
    }

    if (!isSupabaseConfigured) {
      return { data: null, error: staffError || new Error('Invalid credentials') };
    }

    // If Supabase is configured, try Supabase auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
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
    localStorage.removeItem('nandanvan_active_staff');
    localStorage.removeItem('nandanvan_demo_admin');
    setUser(null);
    setProfile(null);

    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    window.location.hash = '#/portal';
    return { error: null };
  };

  const role = profile?.role || user?.role || 'customer';
  const isAdmin = role === 'admin' || role === 'owner';
  const isWaiter = role === 'waiter';
  const isCook = role === 'cook';
  const isStaff = isAdmin || isWaiter || isCook;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isWaiter,
        isCook,
        isStaff,
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
