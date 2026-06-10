import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import {
  isSupabaseConfigured,
  supabasePublicAnonKey,
  supabasePublicUrl,
} from '@/services/supabase/publicEnvironment';
import { appStorage } from '@/storage/appStorage';
import { logger } from '@/utils/logger';

export { isSupabaseConfigured };

/* eslint-disable unicorn/prevent-abbreviations, @typescript-eslint/no-explicit-any, unicorn/prefer-code-point, @typescript-eslint/no-deprecated */
// Polyfill TextEncoder and TextDecoder for React Native (Hermes/JSC compatibility)
if (globalThis.TextEncoder === undefined) {
  (globalThis as any).TextEncoder = class TextEncoder {
    encode(str: string) {
      const utf8Str = unescape(encodeURIComponent(str));
      const arr = new Uint8Array(utf8Str.length);
      for (let i = 0; i < utf8Str.length; i++) {
        arr[i] = utf8Str.charCodeAt(i);
      }
      return arr;
    }
  };
}

if (globalThis.TextDecoder === undefined) {
  (globalThis as any).TextDecoder = class TextDecoder {
    decode(arr: Uint8Array) {
      if (!arr) return '';
      let binStr = '';
      const len = arr.length;
      for (let i = 0; i < len; i++) {
        binStr += String.fromCharCode(arr[i]);
      }
      try {
        return decodeURIComponent(escape(binStr));
      } catch {
        return binStr;
      }
    }
  };
}
/* eslint-enable unicorn/prevent-abbreviations, @typescript-eslint/no-explicit-any, unicorn/prefer-code-point, @typescript-eslint/no-deprecated */

const fallbackSupabaseUrl = 'http://localhost:54321';
const fallbackAnonKey = 'placeholder-anon-key';

const resolvedSupabaseUrl =
  supabasePublicUrl ||
  (process.env.NODE_ENV === 'test' ? fallbackSupabaseUrl : fallbackSupabaseUrl);
const resolvedSupabaseAnonKey =
  supabasePublicAnonKey ||
  (process.env.NODE_ENV === 'test' ? fallbackAnonKey : fallbackAnonKey);

if (!isSupabaseConfigured && process.env.NODE_ENV !== 'test') {
  logger.warn(
    '[supabase] Missing URL or anon key. Copy `.env.example` to `.env`, set EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_KEY, then restart Metro with `npx expo start --clear`. Auth will not work until configured.',
  );
}

export const supabase = createClient(
  resolvedSupabaseUrl,
  resolvedSupabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: {
        // Supabase session storage expects `null` when a key is missing.
        getItem: (key) => appStorage.getString(key) ?? null,
        removeItem: (key) => {
          appStorage.remove(key);
        },
        setItem: (key, value) => {
          appStorage.set(key, value);
        },
      },
    },
  },
);

// Drive token auto-refresh off the app lifecycle. supabase-js refreshes the
// access token via an internal JS timer, but on React Native (especially
// Android) timers are throttled/suspended while the app is backgrounded and
// there is no web-style "visibility" event to resume them. If the token
// expires in the background, the next refresh can fail and supabase-js emits
// SIGNED_OUT — surfacing as a random logout when the user reopens the app.
//
// Starting auto-refresh on foreground forces an immediate refresh tick (so a
// just-expired token is renewed right away) and stopping it on background
// avoids needless work. This is the canonical Supabase RN setup.
if (process.env.NODE_ENV !== 'test' && isSupabaseConfigured) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void supabase.auth.startAutoRefresh();
    } else {
      void supabase.auth.stopAutoRefresh();
    }
  });

  // The listener only fires on transitions; kick off auto-refresh now since the
  // app is active at module load.
  if (AppState.currentState === 'active') {
    void supabase.auth.startAutoRefresh();
  }
}
