import { focusManager, QueryClient } from '@tanstack/react-query';
import { AppState, type AppStateStatus, Platform } from 'react-native';

const STALE_TIME_MS = 30_000;
const GC_TIME_MS = 5 * 60_000;

function bindReactNativeFocusManager(): void {
  if (Platform.OS === 'web') {
    return;
  }

  focusManager.setFocused(AppState.currentState === 'active');

  AppState.addEventListener('change', (status: AppStateStatus) => {
    focusManager.setFocused(status === 'active');
  });
}

bindReactNativeFocusManager();

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 1,
    },
    queries: {
      gcTime: GC_TIME_MS,
      refetchOnWindowFocus: true,
      retry: 2,
      staleTime: STALE_TIME_MS,
    },
  },
});
