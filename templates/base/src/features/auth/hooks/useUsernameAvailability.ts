import { useEffect, useMemo, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';

import { checkUsernameAvailable } from '@/features/auth/api/emailAuth';
import { usernameSchema } from '@/features/auth/api/schemas';

export type UsernameAvailability =
  | 'available'
  | 'checking'
  | 'error'
  | 'idle'
  | 'invalid'
  | 'taken';

const DEBOUNCE_MS = 400;

type RemoteState =
  | { kind: 'available'; username: string }
  | { kind: 'error'; username: string }
  | { kind: 'taken'; username: string };

/**
 * Real-time username availability check with debouncing.
 *
 * Returns:
 *   'idle'      — empty input
 *   'invalid'   — fails the local format/length schema
 *   'checking'  — debounced RPC in-flight
 *   'available' — server confirmed the username is free
 *   'taken'     — server confirmed the username is in use
 *   'error'     — RPC or network failure (caller should not block submit)
 */
export function useUsernameAvailability(
  username: string,
): UsernameAvailability {
  const debounced = useDebounce(username.trim(), DEBOUNCE_MS);

  const candidate = useMemo(() => {
    if (!debounced) return null;
    const parsed = usernameSchema.safeParse(debounced);
    return parsed.success ? parsed.data : null;
  }, [debounced]);

  const localStatus: UsernameAvailability = useMemo(() => {
    if (!debounced) return 'idle';
    if (!candidate) return 'invalid';
    return 'checking';
  }, [debounced, candidate]);

  const [remote, setRemote] = useState<null | RemoteState>(null);

  useEffect(() => {
    if (!candidate) {
      return;
    }

    let cancelled = false;
    void checkUsernameAvailable(candidate).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setRemote({ kind: 'error', username: candidate });
        return;
      }
      setRemote({
        kind: result.available ? 'available' : 'taken',
        username: candidate,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [candidate]);

  if (localStatus !== 'checking') {
    return localStatus;
  }

  if (remote?.username === candidate) {
    return remote.kind;
  }

  return 'checking';
}
