import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { palette } from '@/theme';

import { AppleGlyph, GoogleGlyph } from '@/components/auth/stitchSocialGlyphs';
import { Column, Row, Text } from '@/components/ui';

import { cn } from '@/utils/cn';

type Properties = {
  readonly appleLoading: boolean;
  readonly disabled?: boolean;
  readonly googleLoading: boolean;
  readonly onPressApple: () => void;
  readonly onPressGoogle: () => void;
  readonly showApple: boolean;
  readonly showGoogle: boolean;
};

import { useResponsive } from '@/theme/responsive';

export function SocialAuthSection({
  appleLoading,
  disabled = false,
  googleLoading,
  onPressApple,
  onPressGoogle,
  showApple,
  showGoogle,
}: Properties) {
  const { t } = useTranslation();
  const { isTablet } = useResponsive();

  if (!showGoogle && !showApple) {
    return undefined;
  }

  const busy = disabled || googleLoading || appleLoading;

  return (
    <Column className={isTablet ? 'gap-8' : 'gap-6'}>
      <Row className="items-center">
        <View className="h-px flex-1 bg-neutral-300/60" />
        <Text
          className={cn(
            'mx-4 my-100 font-plusJakartaSansBold uppercase tracking-widest text-muted',
            isTablet ? 'text-[14px]' : 'text-[11px]',
          )}
        >
          {t('screen_ftue.sign_in_social_divider')}
        </Text>
        <View className="h-px flex-1 bg-neutral-300/60" />
      </Row>

      <Row className={isTablet ? 'gap-6' : 'gap-4'}>
        {showGoogle ? (
          <Pressable
            accessibilityRole="button"
            className={cn(
              'flex-1 flex-row items-center justify-center gap-md rounded-xl border border-neutral-300 bg-white active:bg-neutral-200 disabled:opacity-50',
              isTablet ? 'py-lg' : 'py-md',
            )}
            disabled={busy}
            onPress={onPressGoogle}
          >
            {googleLoading ? (
              <ActivityIndicator
                color={palette.primary[500]}
                size={isTablet ? 'large' : 'small'}
              />
            ) : (
              <GoogleGlyph />
            )}
            <Text
              className={cn(
                'font-plusJakartaSansSemiBold text-foreground',
                isTablet ? 'text-lg' : 'text-sm',
              )}
            >
              {t('screen_ftue.sign_in_google')}
            </Text>
          </Pressable>
        ) : undefined}

        {showApple ? (
          <Pressable
            accessibilityRole="button"
            className={cn(
              'flex-1 flex-row items-center justify-center gap-md rounded-xl border border-neutral-300 bg-white active:bg-neutral-200 disabled:opacity-50',
              isTablet ? 'py-lg' : 'py-md',
            )}
            disabled={busy}
            onPress={onPressApple}
          >
            {appleLoading ? (
              <ActivityIndicator
                color={palette.primary[500]}
                size={isTablet ? 'large' : 'small'}
              />
            ) : (
              <AppleGlyph />
            )}
            <Text
              className={cn(
                'font-plusJakartaSansSemiBold text-foreground',
                isTablet ? 'text-lg' : 'text-sm',
              )}
            >
              {t('screen_ftue.sign_in_apple')}
            </Text>
          </Pressable>
        ) : undefined}
      </Row>
    </Column>
  );
}
