import type { Profile } from '../types/profile';
import type { User } from '@supabase/supabase-js';

import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';

import { supabase, throwQueryError } from '@/services/supabase';
import {
  supabasePublicAnonKey,
  supabasePublicUrl,
} from '@/services/supabase/publicEnvironment';

export type { Profile } from '../types/profile';

export const profileService = {
  /**
   * Fetch a profile by user ID
   */
  getProfile: async (id: string): Promise<null | Profile> => {
    const result = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    const data = result.data;
    const error = result.error;

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found

      throwQueryError(error);
    }

    return data;
  },

  /**
   * Update the current user's profile
   */
  updateProfile: async (
    id: string,
    updates: Partial<Profile>,
  ): Promise<Profile> => {
    const result = await supabase
      .from('profiles')
      .upsert({
        id,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    const data = result.data;
    const error = result.error;

    if (error) throwQueryError(error);
    if (!data)
      throwQueryError(new Error('Failed to update profile: No data returned'));
    return data;
  },

  /**
   * Upload an avatar to Supabase Storage and update the profile.
   *
   * RN/Hermes cannot use Blob, FormData file parts, or supabase-js's internal
   * `new Blob([fileBody])` wrapper. Read the picked file as base64 via
   * expo-file-system, decode to ArrayBuffer, then POST the raw bytes directly
   * to the storage REST endpoint.
   */
  uploadAvatar: async (
    userId: string,
    file: { name: string; type: string; uri: string },
  ): Promise<string> => {
    const extension = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/avatar_${Date.now()}.${extension}`;
    const contentType = file.type.startsWith('image/')
      ? file.type
      : `image/${extension === 'jpg' ? 'jpeg' : extension}`;

    const base64 = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const arrayBuffer = decode(base64);

    const session = await supabase.auth.getSession();
    const accessToken = session.data.session?.access_token;
    if (!accessToken) {
      throwQueryError(new Error('Not authenticated'));
    }

    const uploadUrl = `${supabasePublicUrl}/storage/v1/object/avatars/${path}`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: supabasePublicAnonKey,
        'Content-Type': contentType,
        'x-upsert': 'true',
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throwQueryError(
        new Error(
          `Avatar upload failed: ${response.status} ${errorBody}`.trim(),
        ),
      );
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);

    await profileService.updateProfile(userId, {
      avatar_url: data.publicUrl,
    });

    return data.publicUrl;
  },

  /**
   * Remove the user's avatar: best-effort delete the stored object (only when
   * the URL points at our own `avatars` bucket — OAuth/external URLs are left
   * untouched) and clear the `avatar_url` column.
   */
  removeAvatar: async (
    userId: string,
    currentAvatarUrl?: null | string,
  ): Promise<void> => {
    const marker = '/avatars/';
    const markerIndex = currentAvatarUrl?.indexOf(marker) ?? -1;
    if (currentAvatarUrl && markerIndex !== -1) {
      const path = currentAvatarUrl
        .slice(markerIndex + marker.length)
        .split('?')[0];
      if (path) {
        await supabase.storage.from('avatars').remove([path]);
      }
    }

    await profileService.updateProfile(userId, { avatar_url: null });
  },

  /**
   * Update the user's last seen timestamp
   */
  updateLastSeen: async (id: string): Promise<void> => {
    await supabase
      .from('profiles')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', id);
  },

  /**
   * Backfill profile fields from OAuth (Google/Apple) metadata + email.
   * Idempotent: only fills NULL fields. Safe to run after every OAuth sign-in
   * to repair profiles that pre-date the OAuth metadata trigger.
   */
  backfillFromOAuth: async (user: User): Promise<void> => {
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const metaString = (key: string): string =>
      typeof meta[key] === 'string' ? meta[key].trim() : '';

    const emailPrefix = user.email?.split('@')[0]?.toLowerCase().trim() ?? '';

    const existing = await profileService.getProfile(user.id);
    if (!existing) return;

    const patch: Partial<Profile> = {};

    if (!existing.display_name) {
      const next = metaString('full_name') || metaString('name') || emailPrefix;
      if (next) patch.display_name = next;
    }

    if (!existing.avatar_url) {
      const next = metaString('avatar_url') || metaString('picture');
      if (next) patch.avatar_url = next;
    }

    if (!existing.username && emailPrefix) {
      const { data: clash } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', emailPrefix)
        .neq('id', user.id)
        .maybeSingle();

      patch.username = clash
        ? `${emailPrefix}_${user.id.replaceAll('-', '').slice(0, 6)}`
        : emailPrefix;
    }

    if (Object.keys(patch).length === 0) return;

    await profileService.updateProfile(user.id, patch);
  },
};
