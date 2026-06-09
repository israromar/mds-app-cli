#!/usr/bin/env node
/**
 * Builds the Apple OAuth **client secret** Supabase expects: a short-lived JWT
 * signed with your Sign in with Apple private key (.p8).
 *
 * Apple allows this JWT to live at most ~6 months; regenerate and paste into
 * Supabase → Authentication → Providers → Apple → Secret when it expires.
 *
 * Usage:
 *   APPLE_TEAM_ID=ABCDE12345 \
 *   APPLE_KEY_ID=XXXXXXXXXX \
 *   APPLE_SERVICES_ID=com.yourcompany.yourapp.auth \
 *   node scripts/generate-apple-client-secret.mjs /absolute/path/to/AuthKey_XXXXXXXXXX.p8
 *
 * Or set APPLE_P8_PATH instead of the trailing argument.
 */
import { readFileSync } from 'node:fs';

import { SignJWT, importPKCS8 } from 'jose';

const teamId = process.env.APPLE_TEAM_ID?.trim();
const keyId = process.env.APPLE_KEY_ID?.trim();
const servicesId = process.env.APPLE_SERVICES_ID?.trim();
const p8Path = process.argv[2]?.trim() || process.env.APPLE_P8_PATH?.trim();

if (!teamId || !keyId || !servicesId || !p8Path) {
  console.error(
    'Missing env or path. Need APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_SERVICES_ID, and .p8 path (argv[1] or APPLE_P8_PATH).',
  );
  process.exit(1);
}

const privateKeyPem = readFileSync(p8Path, 'utf8');
const key = await importPKCS8(privateKeyPem, 'ES256');

const jwt = await new SignJWT({})
  .setProtectedHeader({ alg: 'ES256', kid: keyId })
  .setIssuer(teamId)
  .setIssuedAt()
  .setExpirationTime('180d')
  .setAudience('https://appleid.apple.com')
  .setSubject(servicesId)
  .sign(key);

console.log(jwt);
