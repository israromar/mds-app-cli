import { Image } from 'expo-image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { useResponsive } from '@/theme/responsive';

import { FtueBrandMark, FtueDecorativeBackground } from '@/components/ftue';
import { SafeScreen } from '@/components/templates';
import { Button, Column, Screen, Text } from '@/components/ui';

import { cn } from '@/utils/cn';

import onboardingStep1 from '@/theme/assets/images/ftue/onboarding_1.png';
import onboardingStep2 from '@/theme/assets/images/ftue/onboarding_2.png';
import onboardingStep3 from '@/theme/assets/images/ftue/onboarding_3.png';

type Properties = {
  readonly onDone: () => void;
};

// Placeholder onboarding artwork — replace with your own in
// src/theme/assets/images/ftue/.
const STEP_IMAGES = [onboardingStep1, onboardingStep2, onboardingStep3];
const STEP_COUNT = STEP_IMAGES.length;

export function AppIntro({ onDone }: Properties) {
  const { t } = useTranslation();
  const { isTablet } = useResponsive();
  const [step, setStep] = useState(1);

  const next = () => {
    if (step < STEP_COUNT) {
      setStep(step + 1);
    } else {
      onDone();
    }
  };

  return (
    <SafeScreen edges={[]}>
      <View className="relative flex-1 bg-neutral-100">
        <FtueDecorativeBackground />
        <Screen className="flex-1 bg-transparent">
          <Column
            className={cn(
              'flex-1 w-full items-center justify-center gap-8',
              isTablet ? 'px-10' : 'px-6',
            )}
          >
            <Animated.View
              entering={FadeIn.duration(420)}
              style={{ alignItems: 'center' }}
            >
              <FtueBrandMark />
            </Animated.View>

            <Animated.View
              entering={FadeIn.delay(80).duration(420)}
              style={{ alignItems: 'center' }}
            >
              <Image
                accessibilityLabel={t(`app:screen_onboarding.step_${step}_title`)}
                className={isTablet ? 'h-72 w-72' : 'h-56 w-56'}
                contentFit="contain"
                source={STEP_IMAGES[step - 1]}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(150).duration(420)}
              style={{ alignItems: 'center', gap: 12 }}
            >
              <Text
                className="text-center font-extrabold text-2xl tracking-tight"
                variant="hero"
              >
                {t(`app:screen_onboarding.step_${step}_title`)}
              </Text>
              <Text className="text-center text-muted max-w-[300px]">
                {t(`app:screen_onboarding.step_${step}_body`)}
              </Text>
            </Animated.View>

            <Column className="w-full max-w-[360px] gap-3">
              <Button onPress={next}>
                {step < STEP_COUNT
                  ? t('app:screen_onboarding.next')
                  : t('app:screen_onboarding.get_started')}
              </Button>
              {step < STEP_COUNT ? (
                <Button variant="ghost" onPress={onDone}>
                  {t('app:screen_onboarding.skip')}
                </Button>
              ) : undefined}
            </Column>
          </Column>
        </Screen>
      </View>
    </SafeScreen>
  );
}
