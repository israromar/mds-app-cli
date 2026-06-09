import type { User } from '@supabase/supabase-js';

const EMAIL_PROVIDERS = new Set(['email', 'phone']);

/**
 * True when the account has at least one identity that authenticates
 * with a password (Supabase email or phone provider). Social-only users
 * (Apple, Google, etc.) cannot use the change-password flow because they
 * have no current password to verify.
 */
export function hasPasswordAuth(user: null | undefined | User): boolean {
  if (!user) return false;

  const identityProviders = user.identities?.map((index) => index.provider) ?? [];
  const metadataProviders = (user.app_metadata?.providers ?? []);
  const primary = (user.app_metadata?.provider ?? '');

  const all = [...identityProviders, ...metadataProviders, primary];
  return all.some((p) => EMAIL_PROVIDERS.has(p));
}

/**
 * Best-effort label for the identity that owns the account
 * (e.g. 'apple', 'google'). Falls back to 'email' or undefined.
 */
export function getPrimaryProvider(
  user: null | undefined | User,
): string | undefined {
  if (!user) return undefined;
  const fromIdentities = user.identities?.[0]?.provider;
  if (fromIdentities) return fromIdentities;
  const metaProviders = user.app_metadata?.providers;
  if (metaProviders?.length) return metaProviders[0];
  return user.app_metadata?.provider;
}

const PROVIDER_LABELS: Record<string, string> = {
  apple: 'Apple',
  azure: 'Microsoft',
  facebook: 'Facebook',
  github: 'GitHub',
  google: 'Google',
};

export function formatProviderName(provider: string | undefined): string {
  if (!provider) return '';
  return PROVIDER_LABELS[provider] ?? provider;
}
