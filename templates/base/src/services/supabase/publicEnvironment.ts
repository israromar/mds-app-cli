function firstNonEmpty(...values: readonly (string | undefined)[]): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return '';
}

/**
 * Supabase URL + anon/publishable key from `.env`, inlined by `babel-plugin-inline-dotenv`.
 * Supports either `SUPABASE_*` or Expo-style `EXPO_PUBLIC_SUPABASE_*` names.
 */
const url = firstNonEmpty(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_URL,
);

const anonKey = firstNonEmpty(
  process.env.EXPO_PUBLIC_SUPABASE_KEY,
  process.env.SUPABASE_ANON_KEY,
);

export const supabasePublicAnonKey = anonKey;
export const supabasePublicUrl = url;
