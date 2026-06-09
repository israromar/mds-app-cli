import type { User } from '@supabase/supabase-js';

import appleAuth from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { profileService } from '@/features/profile/api/profileService';
import { supabase } from '@/services/supabase';
import { isAndroid, isIOS } from '@/utils';

import {
  googleIosClientId,
  googleWebClientId,
  isGoogleOAuthConfigured,
} from '../api/oauthEnvironment';

export type NativeOAuthErrorCode =
  | 'apple_failed'
  | 'apple_invalid_response'
  | 'apple_not_handled'
  | 'apple_not_interactive'
  | 'apple_unsupported'
  | 'cancelled'
  | 'google_not_configured'
  | 'google_play_services_unavailable'
  | 'network'
  | 'no_identity_token'
  | 'unknown';

/**
 * Map an Apple AuthenticationServices AuthorizationError code to a friendly
 * NativeOAuthErrorCode. Apple raises numeric codes (1000–1005) which the
 * underlying NSError surfaces as either a string or number depending on the
 * native bridge version.
 */
export type NativeOAuthResult =
  | {
      readonly code: NativeOAuthErrorCode;
      readonly message?: string;
      readonly ok: false;
    }
  | { readonly ok: true };

function mapAppleErrorCode(rawCode: unknown): NativeOAuthErrorCode {
  const numeric =
    typeof rawCode === 'number'
      ? rawCode
      : typeof rawCode === 'string'
        ? Number.parseInt(rawCode, 10)
        : Number.NaN;

  switch (numeric) {
    case 1001: {
      return 'cancelled';
    }
    case 1002: {
      return 'apple_invalid_response';
    }
    case 1003: {
      return 'apple_not_handled';
    }
    case 1004: {
      return 'apple_failed';
    }
    case 1005: {
      return 'apple_not_interactive';
    }
    default: {
      // 1000 (.unknown) and anything else → generic Apple failure.
      return 'apple_failed';
    }
  }
}

let googleConfigured = false;

export function isAppleSignInSupported(): boolean {
  return isIOS && appleAuth.isSupported;
}

export async function signInWithAppleNative(): Promise<NativeOAuthResult> {
  if (!isAppleSignInSupported()) {
    return { code: 'apple_unsupported', ok: false };
  }

  try {
    const credential = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!credential.identityToken) {
      return {
        code: 'no_identity_token',
        message: 'Missing Apple identity token',
        ok: false,
      };
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      nonce: credential.nonce,
      provider: 'apple',
      token: credential.identityToken,
    });

    if (error) {
      return { code: 'unknown', ok: false };
    }

    if (data.user) {
      await safeBackfillProfile(data.user);
    }

    return { ok: true };
  } catch (error: unknown) {
    const codeProperty: unknown =
      typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : undefined;

    const mapped = mapAppleErrorCode(codeProperty);
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[Apple sign-in failed]',
        mapped,
        error instanceof Error ? error.message : error,
      );
    }
    return { code: mapped, ok: false };
  }
}

export async function signInWithGoogleNative(): Promise<NativeOAuthResult> {
  if (!ensureGoogleConfigured()) {
    return { code: 'google_not_configured', ok: false };
  }

  try {
    if (isAndroid) {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Android caches the last Google account and silently reuses it unless we
      // clear it before presenting the sign-in UI.
      if (GoogleSignin.hasPreviousSignIn()) {
        try {
          await GoogleSignin.signOut();
        } catch {
          // Best-effort: proceed to signIn which will show the account picker.
        }
      }
    }

    const response = await GoogleSignin.signIn();

    if (response.type === 'cancelled') {
      return { code: 'cancelled', ok: false };
    }

    const idToken = response.data?.idToken;
    if (!idToken) {
      return {
        code: 'no_identity_token',
        message: 'Missing Google ID token',
        ok: false,
      };
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) {
      return { code: 'unknown', ok: false };
    }

    if (data.user) {
      await safeBackfillProfile(data.user);
    }

    return { ok: true };
  } catch (error: unknown) {
    const errorCode =
      typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : undefined;

    if (errorCode === statusCodes.SIGN_IN_CANCELLED) {
      return { code: 'cancelled', ok: false };
    }
    if (errorCode === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return { code: 'google_play_services_unavailable', ok: false };
    }
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[Google sign-in failed]',
        errorCode,
        error instanceof Error ? error.message : error,
      );
    }
    return { code: 'network', ok: false };
  }
}

export async function signOutExternalIdentityProviders(): Promise<void> {
  if (!ensureGoogleConfigured()) {
    return;
  }

  try {
    await GoogleSignin.signOut();
  } catch {
    // Best-effort: user may not have used Google this session.
  }

  // On Android, revokeAccess fully disconnects the app from the Google account
  // so the next sign-in shows the account picker instead of silent re-auth.
  if (isAndroid) {
    try {
      await GoogleSignin.revokeAccess();
    } catch {
      // Best-effort: only applies when the user signed in with Google.
    }
  }
}

function ensureGoogleConfigured(): boolean {
  if (!isGoogleOAuthConfigured) {
    return false;
  }
  if (!googleConfigured) {
    GoogleSignin.configure({
      iosClientId: googleIosClientId || undefined,
      offlineAccess: false,
      webClientId: googleWebClientId,
    });
    googleConfigured = true;
  }
  return true;
}

async function safeBackfillProfile(user: User): Promise<void> {
  try {
    await profileService.backfillFromOAuth(user);
  } catch (error) {
    // Best-effort: never block sign-in on profile sync.
    console.warn('Failed to backfill OAuth profile metadata:', error);
  }
}
