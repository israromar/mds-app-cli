import { Image } from 'expo-image';
import { ReactNode } from 'react';
import { Pressable } from 'react-native';

import { Box } from '@/components/ui';

import { getDisplayName, getProfileAvatar } from '@/utils';
import { cn } from '@/utils/cn';

const AVATAR_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

const SIZE_CLASSES: Record<UserAvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-20 w-20',
  '2xl': 'h-24 w-24',
  '3xl': 'h-28 w-28',
};

type ProfileLike = {
  readonly avatar_url?: null | string;
  readonly display_name?: null | string;
  readonly id?: null | string;
  readonly username?: null | string;
};

type UserAvatarProps = {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly disableNavigation?: boolean;
  /**
   * Override the default tap behaviour. When provided, this is invoked instead
   * of navigating to `UserProfile`. Useful for cases like the drawer header
   * where tapping should jump to the signed-in user's own profile tab.
   */
  readonly onPress?: () => void;
  readonly profile: null | ProfileLike | undefined;
  readonly size?: UserAvatarSize;
  readonly userId?: null | string;
};

type UserAvatarSize = '2xl' | '3xl' | 'lg' | 'md' | 'sm' | 'xl';

/**
 * Universal avatar that renders the user's image with a blurhash placeholder
 * and navigates to UserProfile on tap. Built on a plain Box + expo-image
 * (no gluestack Avatar shell) because absolutely-positioned children inside
 * gluestack's Avatar were not being clipped to the rounded corners on iOS.
 *
 * Pass `onPress` to override the default navigation, or `disableNavigation`
 * to render a non-interactive avatar.
 */
export function UserAvatar({
  children = undefined,
  className = '',
  disableNavigation = false,
  onPress = undefined,
  profile,
  size = 'md',
  userId = undefined,
}: UserAvatarProps) {
  const name = getDisplayName(profile ?? undefined);
  const avatar = getProfileAvatar(profile ?? undefined);

  const handlePress = onPress;

  const inner = (
    <Box
      className={cn(
        SIZE_CLASSES[size],
        'rounded-full overflow-hidden bg-neutral-100',
        className,
      )}
    >
      <Image
        accessibilityLabel={name}
        cachePolicy="memory-disk"
        className="h-full w-full"
        contentFit="cover"
        placeholder={{ blurhash: AVATAR_BLURHASH }}
        source={avatar}
        transition={200}
      />
      {children}
    </Box>
  );

  if (disableNavigation || !handlePress) return inner;

  return <Pressable onPress={handlePress}>{inner}</Pressable>;
}
