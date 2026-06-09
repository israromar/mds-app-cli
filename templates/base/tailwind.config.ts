import type { Config } from 'tailwindcss';

const nativewindPreset = require('nativewind/preset');

import {
  fonts,
  fontSize,
  radius,
  spacing,
  tailwindColors,
} from './src/theme/tailwindTokens';

const spacingPx = Object.fromEntries(
  Object.entries(spacing).map(([key, value]) => [key, `${value}px`]),
);

const radiusPx = Object.fromEntries(
  Object.entries(radius).map(([key, value]) => [key, `${value}px`]),
);

const fontSizePx = Object.fromEntries(
  Object.entries(fontSize).map(([key, value]) => [key, `${value}px`]),
);

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.js'],
  plugins: [],
  presets: [nativewindPreset],
  theme: {
    extend: {
      borderRadius: radiusPx,
      colors: tailwindColors,
      fontFamily: {
        body: fonts.plusJakartaSans.normal,
        headline: fonts.inter.semiBold,
        interBold: fonts.inter.bold,
        interMedium: fonts.inter.medium,
        interRegular: fonts.inter.normal,
        interSemiBold: fonts.inter.semiBold,
        mono: fonts.monospace.normal,
        plusJakartaSansBold: fonts.plusJakartaSans.bold,
        plusJakartaSansMedium: fonts.plusJakartaSans.medium,
        plusJakartaSansRegular: fonts.plusJakartaSans.normal,
        plusJakartaSansSemiBold: fonts.plusJakartaSans.semiBold,
      },
      fontSize: fontSizePx,
      spacing: spacingPx,
    },
  },
} satisfies Config;
