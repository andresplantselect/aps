'use client';

import { equals, anyPass } from 'ramda';
import { createContext, useContext, useEffect, useState } from 'react';

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
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  name: null,
  isAuthLoading: true,
  isAdmin: false,
  isUser: false,
  isUnknownUser: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState<string | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isUnknownUser, setIsUnknownUser] = useState(true);

  const [isAuthLoading, setIsAuthLoading] = useState(true);

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
    setIsAuthLoading(false);
  }

  const refreshProfile = async () => {
    if (!user?.id) return;
    await loadProfile(user.id);
  };

  useEffect(() => {
    // Первичная загрузка
    supabase.auth.getUser().then(({ data: { user: supabaseUser } }) => {
      if (supabaseUser) {
        void loadUserProfile(supabaseUser);
      } else {
        applyRole('none');
        setIsAuthLoading(false);
      }
    });

    // Изменения auth (логин / логаут)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (equals(event, 'SIGNED_OUT') || !session) {
        setUser(null);
        applyRole('none');
        setName(null);
        setIsAuthLoading(false);
        return;
      }

      if (session.user) {
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
