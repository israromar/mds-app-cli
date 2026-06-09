import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { BrandPulseLoader, FtueBrandMark } from '@/components/ftue';
import { SafeScreen } from '@/components/templates';
import { Column, Screen, Text } from '@/components/ui';

/**
 * Branded splash shown while the persisted auth session is being hydrated.
 * Purely presentational; routing is decided in Application.tsx.
 */
export function Startup() {
  const { t } = useTranslation();

  return (
    <SafeScreen edges={[]}>
      <View className="relative flex-1 bg-neutral-100">
        <Screen className="flex-1 bg-transparent">
          <Column className="flex-1 w-full items-center justify-center gap-8 px-6">
            <Animated.View entering={FadeIn.duration(420)}>
              <FtueBrandMark />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(180).duration(420)}
              style={{ alignItems: 'center', gap: 24 }}
            >
              <Text className="text-center text-muted max-w-[280px]">
                {t('app:app.description')}
              </Text>
              <BrandPulseLoader />
            </Animated.View>
          </Column>
        </Screen>
      </View>
    </SafeScreen>
  );
}
