import { useWindowDimensions } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BREAKPOINTS = {
  largeTablet: 1024,
  tablet: 768,
} as const;

export const RESPONSIVE_LAYOUT = {
  contentMaxWidth: 1100,
  formMaxWidth: 560,
  largeFormMaxWidth: 800,
} as const;

export type DeviceSize = 'largeTablet' | 'phone' | 'tablet';

export function getDeviceSize(width: number): DeviceSize {
  if (width >= BREAKPOINTS.largeTablet) {
    return 'largeTablet';
  }
  if (width >= BREAKPOINTS.tablet) {
    return 'tablet';
  }
  return 'phone';
}

export function useResponsive() {
  const { top } = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const deviceSize = getDeviceSize(width);

  return {
    deviceSize,
    height,
    offsetTopHeight: top,
    isLandscape: width > height,
    isLargeTablet: deviceSize === 'largeTablet',
    isPhone: deviceSize === 'phone',
    isTablet: deviceSize !== 'phone',
    width,
    contentMaxWidth: RESPONSIVE_LAYOUT.contentMaxWidth,
    formMaxWidth:
      deviceSize === 'largeTablet'
        ? RESPONSIVE_LAYOUT.largeFormMaxWidth
        : RESPONSIVE_LAYOUT.formMaxWidth,
  } as const;
}
