import ky from 'ky';

import { PASSWORD_RESET_API_TIMEOUT_MS } from '@/constants/auth';
import { supabase } from '@/services/supabase';
import {
  supabasePublicAnonKey as anonKey,
  supabasePublicUrl as supabaseUrl,
} from '@/services/supabase/publicEnvironment';

export async function completePasswordReset(parameters: {
  email: string;
  newPassword: string;
  recoveryToken: string;
}): Promise<{ error?: string; ok: boolean }> {
  if (!supabaseUrl || !anonKey) {
    return { error: 'missing_supabase_env', ok: false };
  }

  if (parameters.recoveryToken === 'supabase_session_active') {
    try {
      const { error } = await supabase.auth.updateUser({
        password: parameters.newPassword,
      });

      if (error) {
        return { error: 'password_update_failed', ok: false };
      }
      return { ok: true };
    } catch {
      return { error: 'password_update_failed', ok: false };
    }
  }

  try {
    const response = await ky.post(functionsUrl('complete-password-reset'), {
      headers: invokeHeaders(),
      json: parameters,
      throwHttpErrors: false,
      timeout: PASSWORD_RESET_API_TIMEOUT_MS,
    });

    const body = (await parseJsonBody(response)) as {
      error?: string;
      ok?: boolean;
    };

    if (response.ok && body.ok === true) {
      return { ok: true };
    }
    console.warn(
      'Edge function complete-password-reset returned non-ok, falling back to native updateUser:',
      body.error,
    );
  } catch (error) {
    console.warn(
      'Edge function complete-password-reset threw an error, falling back to native updateUser:',
      error,
    );
  }

  // Fallback to native updateUser if Edge Function was used but failed
  try {
    const { error } = await supabase.auth.updateUser({
      password: parameters.newPassword,
    });

    if (error) {
      return { error: 'password_update_failed', ok: false };
    }
    return { ok: true };
  } catch {
    return { error: 'password_update_failed', ok: false };
  }
}

export async function requestPasswordReset(
  email: string,
): Promise<{ error?: string; ok: boolean }> {
  if (!supabaseUrl || !anonKey) {
    return { error: 'missing_supabase_env', ok: false };
  }

  try {
    const response = await ky.post(functionsUrl('request-password-reset'), {
      headers: invokeHeaders(),
      json: { email },
      throwHttpErrors: false,
      timeout: PASSWORD_RESET_API_TIMEOUT_MS,
    });

    const body = (await parseJsonBody(response)) as {
      error?: string;
      ok?: boolean;
    };

    if (response.ok && body.ok === true) {
      return { ok: true };
    }
    console.warn(
      'Edge function request-password-reset returned non-ok, falling back to native reset:',
      body.error,
    );
  } catch (error) {
    console.warn(
      'Edge function request-password-reset threw an error, falling back to native reset:',
      error,
    );
  }

  // Native Fallback
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      // In case user is not found, return user_not_found as standard translated error key
      return { error: 'user_not_found', ok: false };
    }
    return { ok: true };
  } catch {
    return { error: 'request_failed', ok: false };
  }
}

export async function verifyPasswordResetCode(
  email: string,
  code: string,
): Promise<{ error?: string; ok: boolean; recoveryToken?: string }> {
  if (!supabaseUrl || !anonKey) {
    return { error: 'missing_supabase_env', ok: false };
  }

  try {
    const response = await ky.post(functionsUrl('verify-password-reset-code'), {
      headers: invokeHeaders(),
      json: { code, email },
      throwHttpErrors: false,
      timeout: PASSWORD_RESET_API_TIMEOUT_MS,
    });

    const body = (await parseJsonBody(response)) as {
      error?: string;
      recoveryToken?: string;
    };

    if (response.ok && typeof body.recoveryToken === 'string') {
      return { ok: true, recoveryToken: body.recoveryToken };
    }
    console.warn(
      'Edge function verify-password-reset-code returned non-ok, falling back to native verifyOtp:',
      body.error,
    );
  } catch (error) {
    console.warn(
      'Edge function verify-password-reset-code threw an error, falling back to native verifyOtp:',
      error,
    );
  }

  // Native Fallback
  try {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'recovery',
    });

    if (error) {
      return { error: 'invalid_or_expired_code', ok: false };
    }

    return { ok: true, recoveryToken: 'supabase_session_active' };
  } catch {
    return { error: 'request_failed', ok: false };
  }
}

function functionsUrl(functionName: string): string {
  const base = supabaseUrl.replace(/\/$/, '');
  return `${base}/functions/v1/${functionName}`;
}

function invokeHeaders(): Record<string, string> {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  };
}

async function parseJsonBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
