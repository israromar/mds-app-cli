import { type User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { signOutExternalIdentityProviders } from '@/features/auth/api/nativeOAuth';
import { type Profile } from '@/features/profile/types/profile';
import { isSupabaseConfigured, supabase } from '@/services/supabase';
import { getSessionWithTimeout } from '@/services/supabase/getSessionWithTimeout';
import { appStorage } from '@/storage/appStorage';

type AuthState = {
  clearSession: () => void;
  deleteAccount: () => Promise<{ error: Error | null }>;
  hydrateSession: () => Promise<void>;
  isAuthenticated: boolean;
  /**
   * True while the user is in the middle of the password-recovery flow. Keeps
   * them in the auth stack until a new password is set. Never persisted.
   */
  isPasswordRecovery: boolean;
  loading: boolean;
  profile: null | Profile;
  setPasswordRecovery: (active: boolean) => void;
  setProfile: (profile: null | Profile) => void;
  setSession: (user: null | User) => void;
  signOut: () => Promise<{ error: Error | null }>;
  user: null | User;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isPasswordRecovery: false,
      loading: true,
      setSession: (user) =>
        set({ user, isAuthenticated: !!user, loading: false }),
      setPasswordRecovery: (active) => set({ isPasswordRecovery: active }),
      setProfile: (profile) => set({ profile }),
      clearSession: () =>
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          loading: false,
        }),
      hydrateSession: async () => {
        if (!isSupabaseConfigured) {
          set({ user: null, isAuthenticated: false, loading: false });
          return;
        }
        const session = await getSessionWithTimeout();
        set({
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
          loading: false,
        });
      },
      signOut: async () => {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          loading: false,
        });
        const { error } = await supabase.auth.signOut();
        await signOutExternalIdentityProviders();
        return { error };
      },
      deleteAccount: async () => {
        // Expects a Postgres function `delete_user_account` (see
        // docs/NATIVE_AUTH_SETUP.md). Remove if you do not support deletion.
        const { error } = await supabase.rpc('delete_user_account');
        if (!error) {
          await supabase.auth.signOut();
          await signOutExternalIdentityProviders();
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            loading: false,
          });
        }
        return { error };
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
      storage: createJSONStorage(() => ({
        getItem: (name) => appStorage.getString(name) ?? null,
        setItem: (name, value) => appStorage.set(name, value),
        removeItem: (name) => appStorage.remove(name),
      })),
    },
  ),
);
