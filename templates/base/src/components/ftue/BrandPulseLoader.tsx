import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { palette } from '@/theme';

const DOTS = [0, 1, 2] as const;
const PULSE_DURATION = 480;
const PULSE_GAP = 160;

type BrandPulseLoaderProps = {
  readonly color?: string;
  readonly size?: number;
};

type PulseDotProps = {
  readonly color: string;
  readonly delay: number;
  readonly size: number;
};

export function BrandPulseLoader({
  color = palette.primary[500],
  size = 10,
}: BrandPulseLoaderProps) {
  return (
    <View
      accessibilityLabel="Loading"
      accessibilityRole="progressbar"
      style={{ flexDirection: 'row', gap: 8 }}
    >
      {DOTS.map((index) => (
        <PulseDot
          color={color}
          delay={index * PULSE_GAP}
          key={index}
          size={size}
        />
      ))}
    </View>
  );
}

function PulseDot({ color, delay, size }: PulseDotProps) {
  const progress = useSharedValue(0.35);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: PULSE_DURATION }),
          withTiming(0.35, { duration: PULSE_DURATION }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.8 + progress.value * 0.4 }],
  }));

  return (
    <Animated.View
      style={[
        {
          backgroundColor: color,
          borderRadius: size / 2,
          height: size,
          width: size,
        },
        animatedStyle,
      ]}
    />
  );
}
