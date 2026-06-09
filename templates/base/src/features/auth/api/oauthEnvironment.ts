function firstNonEmpty(...values: readonly (string | undefined)[]): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return '';
}

/** Google OAuth Web client ID (required for native Google Sign-In ID tokens). */
export const googleWebClientId = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID as string | undefined,
  process.env.GOOGLE_WEB_CLIENT_ID as string | undefined,
);

/** Optional iOS OAuth client ID when not using GoogleService-Info.plistGOOGLE_IOS_CLIENT_ID. */
export const googleIosClientId = firstNonEmpty(
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID as string | undefined,
  process.env.GOOGLE_IOS_CLIENT_ID as string | undefined,
);

export const isGoogleOAuthConfigured = Boolean(googleWebClientId);
