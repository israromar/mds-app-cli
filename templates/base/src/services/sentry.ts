import * as Sentry from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

let initialized = false;

/**
 * Initialize Sentry once at app startup. No-ops when DSN is unset (local dev).
 */
export function captureException(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (!initialized) {
    return;
  }
  if (context) {
    Sentry.withScope((scope) => {
      scope.setExtras(context);
      Sentry.captureException(error);
    });
    return;
  }
  Sentry.captureException(error);
}

export function initSentry(): void {
  if (initialized || !dsn) {
    return;
  }

  Sentry.init({
    dsn,
    enabled: !__DEV__,
    tracesSampleRate: __DEV__ ? 0 : 0.2,
    enableAutoSessionTracking: true,
    attachStacktrace: true,
  });

  initialized = true;
}

export * as Sentry from '@sentry/react-native';
