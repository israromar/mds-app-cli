import { type Session } from '@supabase/supabase-js';

import { supabase } from '@/services/supabase/client';

const DEFAULT_TIMEOUT_MS = 8000;

/**
 * Reads the cached session from Supabase auth storage, with a hard timeout so
 * startup navigation is never blocked by a hung token refresh / network call.
 */
export async function getSessionWithTimeout(
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<null | Session> {
  try {
    const result = await Promise.race([
      supabase.auth.getSession(),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), timeoutMs);
      }),
    ]);
    if (result === null) {
      console.warn(`[auth] getSession timed out after ${timeoutMs}ms`);
      return null;
    }
    if (result.error) {
      console.warn('[auth] getSession error:', result.error.message);
      return null;
    }
    return result.data.session;
  } catch (error) {
    console.error('[auth] getSession failed:', error);
    return null;
  }
}
