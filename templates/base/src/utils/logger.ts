/**
 * Tiny dev-only logger. In production builds (`__DEV__ === false`) the calls
 * become no-ops so we don't ship console noise. In dev they forward to
 * `console.warn` / `console.error` so Reactotron and Metro keep working.
 *
 * Use this for diagnostic logs. For user-facing errors, surface a Toast/Alert.
 */

type LogArguments = readonly unknown[];

export const logger = {
  warn: (...arguments_: LogArguments): void => {
    if (__DEV__) console.warn(...arguments_);
  },
  error: (...arguments_: LogArguments): void => {
    if (__DEV__) console.error(...arguments_);
  },
};
