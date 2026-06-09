import { View } from 'react-native';

import { useResponsive } from '@/theme/responsive';

import { cn } from '@/utils/cn';

/**
 * Soft gradient-like layers (social / product-style hero) without native LinearGradient.
 */
export function FtueDecorativeBackground() {
  const { width, height, isTablet } = useResponsive();

  // Use a constrained base dimension on tablets to prevent giant, bloated shapes
  const baseSize = isTablet ? 420 : width;

  const circle1Size = baseSize * 0.8;
  const circle2Size = baseSize;
  const circle3Size = baseSize * 0.45;
  const circle4Size = baseSize * 0.25;

  return (
    <View className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-neutral-200">
      {/* Top Right Decorative Shape */}
      <View
        className={cn('absolute rounded-full bg-primary-200 opacity-50')}
        style={{
          height: circle1Size,
          right: isTablet ? -circle1Size * 0.15 : -width * 0.2,
          top: isTablet ? -circle1Size * 0.25 : -width * 0.3,
          width: circle1Size,
        }}
      />
      {/* Bottom Left Decorative Shape */}
      <View
        className={cn('absolute rounded-full bg-primary-100 opacity-70')}
        style={{
          bottom: isTablet ? -height * 0.12 : -height * 0.1,
          height: circle2Size,
          left: isTablet ? -circle2Size * 0.15 : -width * 0.2,
          width: circle2Size,
        }}
      />
      {/* Middle Right Decorative Shape */}
      <View
        className={cn('absolute rounded-full bg-secondary-200 opacity-30')}
        style={{
          bottom: isTablet ? height * 0.22 : height * 0.18,
          height: circle3Size,
          right: isTablet ? width * 0.08 : width * 0.05,
          width: circle3Size,
        }}
      />
      {/* Middle Left Decorative Shape */}
      <View
        className={cn('absolute rounded-full bg-accent-200 opacity-25')}
        style={{
          height: circle4Size,
          left: isTablet ? width * 0.08 : width * 0.1,
          top: isTablet ? height * 0.25 : height * 0.3,
          width: circle4Size,
        }}
      />
    </View>
  );
}
