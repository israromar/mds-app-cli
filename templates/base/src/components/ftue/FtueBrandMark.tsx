import { Image } from 'expo-image';

import { useResponsive } from '@/theme/responsive';

import { Column, Text } from '@/components/ui';

import { APP_CONFIG } from '@/constants/app';

type Properties = {
  readonly compact?: boolean;
};

export function FtueBrandMark({ compact = false }: Properties) {
  const { logo, name } = APP_CONFIG;
  const { isTablet } = useResponsive();

  const imageClass = compact
    ? isTablet
      ? 'h-24 w-24'
      : 'h-16 w-16'
    : isTablet
      ? 'h-36 w-36'
      : 'h-24 w-24';

  return (
    <Column className="items-center">
      <Image
        accessibilityLabel={name}
        className={imageClass}
        contentFit="contain"
        source={logo}
      />
      {compact ? undefined : (
        <Text
          className={
            isTablet
              ? 'font-headline mt-6 text-5xl font-black tracking-tighter text-primary-600'
              : 'font-headline mt-4 text-3xl font-black tracking-tighter text-primary-600'
          }
        >
          {name}
        </Text>
      )}
    </Column>
  );
}
