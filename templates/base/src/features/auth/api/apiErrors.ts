import type { TFunction } from 'i18next';

export function translateAuthError(
  translation: TFunction,
  code: string | undefined,
): string {
  const key = code && code.length > 0 ? code.replaceAll('-', '_') : 'unknown';

  return translation(`screen_ftue.errors.${key}`, {
    defaultValue: translation('screen_ftue.errors.unknown'),
  });
}

export function translatePasswordResetError(
  translation: TFunction,
  code: string | undefined,
): string {
  const key = code && code.length > 0 ? code : 'unknown';

  return translation(`screen_ftue.errors.${key}`, {
    defaultValue: translation('screen_ftue.errors.unknown'),
  });
}
