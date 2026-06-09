import { BlurView } from '@react-native-community/blur';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Box } from './layout';
import { Text } from './Text';

type LoadingViewProps = {
  readonly message?: string;
  readonly transparent?: boolean;
};

/**
 * A premium, subtle loading view with smooth animations and glassmorphism.
 * Can be used for full-screen loading or as an overlay.
 */
export function LoadingView({
  message = undefined,
  transparent = false,
}: LoadingViewProps) {
  const { t } = useTranslation();
  const opacity = useSharedValue(0.4);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.4, { duration: 1000 }),
      ),
      -1,
      true,
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const displayMessage = message ?? t('app:common_loading');

  return (
    <Animated.View className="flex-1" entering={FadeIn}>
      {transparent ? (
        <BlurView
          blurAmount={10}
          blurType="materialLight"
          reducedTransparencyFallbackColor="white"
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View className="absolute inset-0 bg-surface" />
      )}

      <VStack className="flex-1 items-center justify-center gap-6">
        <Animated.View style={animatedStyle}>
          <Box className="w-16 h-16 rounded-[24px] bg-primary-500 items-center justify-center shadow-xl shadow-primary-500/30">
            <View className="w-8 h-8 rounded-lg border-2 border-white/30 border-t-white animate-spin" />
            <Box className="absolute w-4 h-4 rounded-full bg-white shadow-sm" />
          </Box>
        </Animated.View>

        {displayMessage ? (
          <Animated.View entering={FadeIn.delay(300)}>
            <Text className="font-plusJakartaSansBold text-xs text-neutral-400 uppercase tracking-[2px]">
              {displayMessage}
            </Text>
          </Animated.View>
        ) : null}
      </VStack>
    </Animated.View>
  );
}

// Internal VStack since we might not have exported it yet or for simplicity in this atomic component
function VStack({
  children,
  className = '',
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return <View className={`flex-col ${className}`}>{children}</View>;
}
