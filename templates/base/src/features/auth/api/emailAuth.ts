import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/services/supabase';

/**
 * Hard ceiling for an auth network call. When the device is offline (or the
 * server is unreachable) the underlying fetch can hang well past a reasonable
 * wait, leaving the sign-in button stuck in its loading state. We race every
 * request against this timeout so the UI always recovers and can show a
 * "check your connection" message.
 */
const AUTH_NETWORK_TIMEOUT_MS = 12_000;

class TimeoutError extends Error {}

async function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new TimeoutError('timeout')), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function isNetworkError(error: unknown): boolean {
  if (error instanceof TimeoutError) return true;
  const message = (
    error instanceof Error ? error.message : String(error)
  ).toLowerCase();
  return (
    message.includes('network request failed') ||
    message.includes('network error') ||
    message.includes('failed to fetch') ||
    message.includes('timeout')
  );
}

export type EmailAuthErrorCode =
  | 'email-not-confirmed'
  | 'invalid-credentials'
  | 'network-error'
  | 'unknown'
  | 'user-already-exists'
  | 'username-already-exists'
  | 'weak-password';

export type EmailAuthResult =
  | {
      readonly code: EmailAuthErrorCode;
      readonly message: string;
      readonly ok: false;
    }
  | {
      readonly ok: true;
      readonly session?: null | Session;
      readonly user?: null | User;
    };

/**
 * Server-authoritative check for whether a username is currently free.
 * Returns true when the username is available, false when it's taken or
 * when the lookup fails (network or RPC error). Callers must still rely
 * on the unique constraint at insert time — this is purely a UX hint to
 * give users immediate feedback before submitting the form.
 */
export async function checkUsernameAvailable(
  username: string,
): Promise<{ available: boolean; ok: boolean }> {
  const trimmed = username.trim();
  if (!trimmed) {
    return { available: false, ok: true };
  }

  const { data, error } = await supabase.rpc('is_username_available', {
    p_username: trimmed,
  });

  if (error) {
    return { available: false, ok: false };
  }

  return { available: data, ok: true };
}

/**
 * Sign up a new user with email and password.
 * Note: For MVP validation, email verification is typically handled via Supabase Dashboard settings.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: Record<string, unknown>,
): Promise<EmailAuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      options: {
        data: metadata,
      },
      password,
    });

    if (error) {
      const message = error.message.toLowerCase();

      if (message.includes('already registered')) {
        return {
          code: 'user-already-exists',
          message: '',
          ok: false,
        };
      }

      if (
        message.includes('profiles_username_key') ||
        (message.includes('unique constraint') && message.includes('username'))
      ) {
        return {
          code: 'username-already-exists',
          message: '',
          ok: false,
        };
      }

      if (
        message.includes('password should contain') ||
        message.includes('weak_password')
      ) {
        return {
          code: 'weak-password',
          message: '',
          ok: false,
        };
      }

      return {
        code: 'unknown',
        message: error.message,
        ok: false,
      };
    }

    return { ok: true, session: data.session, user: data.user };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    return { code: 'unknown', message, ok: false };
  }
}

/**
 * Sign in an existing user with email or username and password.
 */
/**
 * Re-authenticate the current user, then update their password.
 * Two-step flow because Supabase requires a verified password on the same session.
 */
export async function changePasswordWithReauth(parameters: {
  currentPassword: string;
  email: string;
  newPassword: string;
}): Promise<
  | {
      code: 'incorrect-current' | 'unknown' | 'update-failed';
      message: string;
      ok: false;
    }
  | { ok: true }
> {
  const { currentPassword, email, newPassword } = parameters;

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (authError) {
    return {
      code: 'incorrect-current',
      message: authError.message,
      ok: false,
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (updateError) {
    return { code: 'update-failed', message: updateError.message, ok: false };
  }
  return { ok: true };
}

/**
 * Set a password for the first time (e.g. for users who signed up via
 * Apple / Google OAuth and have no email-password identity yet). The
 * existing OAuth session is trusted, so no re-authentication is required.
 * After this succeeds, the user can sign in with username + password.
 */
export async function setInitialPassword(parameters: {
  newPassword: string;
}): Promise<
  | {
      code: 'unknown' | 'update-failed' | 'weak-password';
      message: string;
      ok: false;
    }
  | { ok: true; user: null | User }
> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: parameters.newPassword,
    });
    if (error) {
      const lower = error.message.toLowerCase();
      if (
        lower.includes('password should contain') ||
        lower.includes('weak_password')
      ) {
        return { code: 'weak-password', message: error.message, ok: false };
      }
      return { code: 'update-failed', message: error.message, ok: false };
    }

    // The /user response from updateUser contains the freshly mutated user
    // (with the new `email` identity attached). Some Supabase builds return
    // it in `data.user`, others surface it through getUser(); fall back to
    // an explicit fetch so the caller always gets the latest identities.
    let user = data?.user ?? null;
    if (!user?.identities?.some((index) => index.provider === 'email')) {
      const refreshed = await supabase.auth.getUser();
      user = refreshed.data?.user ?? user;
    }
    return { ok: true, user };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    return { code: 'unknown', message, ok: false };
  }
}

/**
 * Resend the email-verification message for the given address.
 */
export async function resendSignupConfirmation(
  email: string,
): Promise<{ error?: string; ok: boolean }> {
  const { error } = await supabase.auth.resend({ email, type: 'signup' });
  if (error) return { error: error.message, ok: false };
  return { ok: true };
}

export async function signInWithEmail(
  identifier: string,
  password: string,
): Promise<EmailAuthResult> {
  try {
    let email = identifier.trim();

    // If identifier doesn't look like an email, assume it's a username and lookup the email
    if (!email.includes('@')) {
      const response = await withTimeout(
        supabase.rpc('get_email_by_username', {
          p_username: email,
        }),
        AUTH_NETWORK_TIMEOUT_MS,
      );

      const rpcError = response.error;
      const data = response.data;

      if (rpcError || !data) {
        return {
          code: 'invalid-credentials',
          message: 'Invalid username or password.',
          ok: false,
        };
      }

      email = data;
    }

    const { error } = await withTimeout(
      supabase.auth.signInWithPassword({
        email,
        password,
      }),
      AUTH_NETWORK_TIMEOUT_MS,
    );

    if (error) {
      const message = error.message.toLowerCase();
      if (
        message.includes('confirm') ||
        message.includes('verified') ||
        message.includes('not confirmed')
      ) {
        return {
          code: 'email-not-confirmed',
          message:
            'Your email address is not verified. Please check your inbox.',
          ok: false,
        };
      }
      return {
        code: 'invalid-credentials',
        message: 'Invalid email or password.',
        ok: false,
      };
    }

    return { ok: true };
  } catch (error: unknown) {
    if (isNetworkError(error)) {
      return {
        code: 'network-error',
        message: 'Network error',
        ok: false,
      };
    }
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    return { code: 'unknown', message, ok: false };
  }
}
