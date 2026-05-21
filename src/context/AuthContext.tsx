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

  async function loadAuth() {
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (supabaseUser) {
      const formattedUser: UserType = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name ?? null,
        role: supabaseUser.user_metadata?.role ?? 'none',
        created_at: supabaseUser.created_at,
      };

      setUser(formattedUser);

      await loadProfile(supabaseUser.id);
    } else {
      setUser(null);
      applyRole('none');
      setName(null);
    }

    setIsAuthLoading(false);
  }

  const refreshProfile = async () => {
    if (!user?.id) return;
    await loadProfile(user.id);
  };

  useEffect(() => {
    void loadAuth();

    supabase.auth.onAuthStateChange((event, session) => {
      if (equals(event, 'SIGNED_OUT') || !session) {
        setUser(null);
        applyRole('none');
        setName(null);
        setIsAuthLoading(false);
        return;
      }

      void loadAuth();
    });
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
