import { DefaultTheme } from '@react-navigation/native';

import {
  flatPalette,
  fontSize,
  radius,
  semanticColors,
  spacing,
} from '@/theme/tailwindTokens';
import type { ThemeConfiguration } from '@/theme/types/config';

export {
  flatPalette,
  fonts,
  fontSize,
  gradients,
  palette,
  radius,
  semanticColors,
  spacing,
  tailwindColors,
} from '@/theme/tailwindTokens';
export type { SpacingKey } from '@/theme/tailwindTokens';

/**
 * consolidated Theme Configuration
 * palette, typography, and spacing tokens in one place.
 */

export const config = {
  backgrounds: flatPalette,
  borders: {
    colors: flatPalette,
    radius: Object.values(radius),
    widths: [1, 2],
  },
  colors: {
    ...flatPalette,
    error: semanticColors.error,
  },
  fonts: {
    colors: flatPalette,
    sizes: Object.values(fontSize),
  },
  gutters: Object.values(spacing),
  navigationColors: {
    ...DefaultTheme.colors,
    background: semanticColors.background,
    border: semanticColors.border,
    card: semanticColors.background,
    notification: semanticColors.error,
    primary: semanticColors.tint,
    text: semanticColors.text,
  },
} as const satisfies ThemeConfiguration;
