/**
 * Generic profile shape. Replace/extend to match your Supabase `profiles`
 * table (run `supabase gen types typescript` to generate exact row types).
 */
export type Profile = {
  id: string;
  username?: null | string;
  full_name?: null | string;
  display_name?: null | string;
  avatar_url?: null | string;
  bio?: null | string;
  created_at?: null | string;
  updated_at?: null | string;
};
