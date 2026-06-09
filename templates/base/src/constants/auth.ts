/** Cooldown before requesting another reset email (seconds). */
export const PASSWORD_RESET_RESEND_COOLDOWN_SECONDS = 60;

/** Six-digit verification codes for password reset. */
export const PASSWORD_RESET_CODE_LENGTH = 6;

/** Minimum password length (aligned with Edge Function). */
export const PASSWORD_MIN_LENGTH = 6;

/** Maximum username length (display handle). */
export const USERNAME_MAX_LENGTH = 32;

/** HTTP timeout for Supabase Edge Function calls (ms). */
export const PASSWORD_RESET_API_TIMEOUT_MS = 30_000;
