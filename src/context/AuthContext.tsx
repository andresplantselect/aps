'use client';

import { equals, anyPass } from 'ramda';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { supabase } from '@/lib/supabase';
import { UserType } from '@/src/types/types';

type AuthContextType = {
  userId: string | null;
  user: UserType | null;
  name: string | null;
  isAuthLoading: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isUnknownUser: boolean;
  isRecovering: boolean;
  refreshProfile: (overrideUserId?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  name: null,
  isAuthLoading: true,
  isAdmin: false,
  isUser: false,
  isUnknownUser: true,
  isRecovering: false,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState<string | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isUnknownUser, setIsUnknownUser] = useState(true);

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  const isRecoveringRef = useRef(isRecovering);

  async function loadProfile(userId: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', userId)
      .single();

    const dbRole = profile?.role ?? 'none';

    applyRole(dbRole);
    setName(profile?.name ?? null);
  }

  const applyRole = (role: string | null) => {
    const safeRole = role ?? 'none';
    const isAdminRole = equals(safeRole, 'admin');
    const isUserRole = equals(safeRole, 'user');
    const isNone = !anyPass([equals('admin'), equals('user')])(safeRole);

    setIsAdmin(isAdminRole);
    setIsUser(isUserRole);
    setIsUnknownUser(isNone);
  };

  async function loadUserProfile(supabaseUser: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
    created_at?: string;
  }) {
    setIsAuthLoading(true);

    setUser({
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: (supabaseUser.user_metadata?.name as string) ?? null,
      role: supabaseUser.user_metadata?.role as 'user' | 'admin' | undefined,
      created_at: supabaseUser.created_at,
    });

    await loadProfile(supabaseUser.id);
    // clear recovery flag when a real profile is loaded
    setIsRecovering(false);
    setIsAuthLoading(false);
  }

  const refreshProfile = async (overrideUserId?: string) => {
    const id = overrideUserId ?? user?.id;
    if (!id) return;
    await loadProfile(id);
  };

  useEffect(() => {
    // Initial load
    // detect if we are handling a password recovery flow (hash contains type=recovery)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      // also check pathname in case the hash was cleaned by the auth client
      const isOnResetPath =
        window.location.pathname.includes('/reset-password');
      if (hash.includes('type=recovery') || isOnResetPath) {
        setIsRecovering(true);
        isRecoveringRef.current = true;
      }
    }

    const timeout = setTimeout(() => {
      setIsAuthLoading(false);
    }, 5000);

    supabase.auth.getUser().then(({ data: { user: supabaseUser } }) => {
      clearTimeout(timeout);
      if (supabaseUser) {
        // If we are in password recovery flow, do not treat the recovery session as an authenticated
        // session for loading private profile data — just keep the recovering flag and stop the loader.
        const hash =
          typeof window !== 'undefined' ? window.location.hash || '' : '';
        const isOnResetPath =
          typeof window !== 'undefined' &&
          window.location.pathname.includes('/reset-password');
        if (hash.includes('type=recovery') || isOnResetPath) {
          setIsRecovering(true);
          isRecoveringRef.current = true;
          setIsAuthLoading(false);
        } else {
          void loadUserProfile(supabaseUser);
        }
      } else {
        applyRole('none');
        setIsAuthLoading(false);
      }
    });

    // Auth changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (equals(event, 'SIGNED_OUT') || !session) {
        setUser(null);
        applyRole('none');
        setName(null);
        setIsAuthLoading(false);
        setIsRecovering(false);
        return;
      }

      if (equals(event, 'PASSWORD_RECOVERY')) {
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.includes('/reset-password')
        ) {
          window.location.replace('/reset-password');
        }
        // mark that we are in recovery flow so UI does not show private content
        setIsRecovering(true);
        isRecoveringRef.current = true;
        return;
      }

      // Don't treat a recovery session as a signed-in session for loading private data.
      if (session.user && !isRecoveringRef.current) {
        void loadUserProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.id ?? null,
        name,
        isAuthLoading,
        isAdmin,
        isUser,
        isRecovering,
        isUnknownUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
