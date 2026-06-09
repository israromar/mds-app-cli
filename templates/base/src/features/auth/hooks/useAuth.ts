import { useAuthStore } from '@/store/authStore';

/**
 * Read auth state from the persisted Zustand store.
 * Session sync is handled once in Application.tsx via hydrateSession + onAuthStateChange.
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const signOut = useAuthStore((state) => state.signOut);

  return {
    user,
    userId: user?.id,
    isAuthenticated: !!user,
    loading,
    signOut,
  };
};
