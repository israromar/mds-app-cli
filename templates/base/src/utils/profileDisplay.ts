import { getFallbackAvatar } from './avatar';

/**
 * Minimal shape required to derive a display name / avatar.
 * Compatible with the full `Profile`, RPC trimmings (e.g. `nearby_at_checkin.person`),
 * connection rows, notification actors, etc.
 */
export type DisplayNameOptions = {
  /** Email used to derive a `local-part` fallback (e.g. for the signed-in user). */
  readonly email?: null | string;
  /** Final fallback when nothing else resolves. Defaults to `'User'`. */
  readonly fallback?: string;
};

export type DisplayProfileLike = {
  readonly avatar_url?: null | string;
  readonly display_name?: null | string;
  readonly username?: null | string;
};

export type ProfileAvatarOptions = {
  readonly avatarOptions?: Parameters<typeof getFallbackAvatar>[1];
} & DisplayNameOptions;

const firstNonEmpty = (
  ...candidates: readonly (null | string | undefined)[]
): string | undefined => {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }
  return undefined;
};

/**
 * Single source of truth for a user's display name.
 * Priority: `display_name` → `username` → email local-part → `options.fallback` → `'User'`.
 */
export function getDisplayName(
  profile: DisplayProfileLike | null | undefined,
  options: DisplayNameOptions = {},
): string {
  const emailPrefix = options.email?.split('@')[0];
  return (
    firstNonEmpty(profile?.display_name, profile?.username, emailPrefix) ??
    options.fallback ??
    'User'
  );
}

/**
 * Single source of truth for a user's avatar.
 * Falls back to a generated avatar built from the resolved display name.
 */
export function getProfileAvatar(
  profile: DisplayProfileLike | null | undefined,
  options: ProfileAvatarOptions = {},
): string {
  if (profile?.avatar_url && profile.avatar_url.trim().length > 0) {
    return profile.avatar_url;
  }
  return getFallbackAvatar(
    getDisplayName(profile, options),
    options.avatarOptions,
  );
}
