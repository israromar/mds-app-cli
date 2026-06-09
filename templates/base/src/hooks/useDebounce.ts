import { useEffect, useState } from 'react';

/**
 * Returns the most recent value after `delayMs` of stable input.
 * Use to throttle search inputs and other rapid-firing UI signals
 * before they reach network calls.
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
