/**
 * Design tokens for Tailwind / NativeWind only.
 * Keep this file free of react-native and @react-navigation imports so
 * tailwindcss/loadConfig (Sucrase via jiti) can load it at Metro startup.
 */

const neutralLight = {
  100: '#FFFFFF',
  200: '#F0F2F5',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1A1C1E',
  900: '#000000',
} as const;

const primaryLight = {
  50: '#F0F5FF',
  100: '#E6EEFF',
  200: '#B3CCFF',
  300: '#80AAFF',
  400: '#4D88FF',
  500: '#0049e6',
  600: '#0040cb',
  700: '#003199',
  800: '#002166',
  900: '#001a63',
} as const;

const secondaryLight = {
  100: '#FFEBE6',
  200: '#FFC2B3',
  300: '#FF9980',
  400: '#FF704D',
  500: '#b22200',
  600: '#9c1c00',
  700: '#8d1900',
  800: '#6a1000',
  900: '#33120A',
} as const;

const accentLight = {
  100: '#FFF5E6',
  200: '#FFE0B3',
  300: '#FFCB80',
  400: '#FFB74D',
  500: '#fe9d00',
  600: '#ec9100',
} as const;

export const palette = {
  accent: accentLight,
  neutral: neutralLight,
  primary: primaryLight,
  secondary: secondaryLight,
} as const;

export const gradients = {
  primary: ['#0049e6', '#829bff'],
  secondary: [secondaryLight[400], secondaryLight[500]],
  vibrant: ['#8637CF', '#0F55A1'],
} as const;

export const semanticColors = {
  accent: accentLight[500],
  background: '#f6f6f9',
  border: neutralLight[300],
  error: '#b41340',
  success: '#10b981',
  text: '#2d2f31',
  textDim: '#5a5c5e',
  tint: primaryLight[500],
} as const;

export const tailwindColors = {
  accent: accentLight,
  background: semanticColors.background,
  border: semanticColors.border,
  error: semanticColors.error,
  foreground: semanticColors.text,
  highlight: accentLight[500],
  muted: semanticColors.textDim,
  neutral: neutralLight,
  primary: primaryLight,
  secondary: secondaryLight,
  tint: semanticColors.tint,
} as const;

export const flatPalette = {
  ...semanticColors,
  accent100: accentLight[100],
  accent200: accentLight[200],
  accent300: accentLight[300],
  accent400: accentLight[400],
  accent500: accentLight[500],
  accent600: accentLight[600],
  neutral100: neutralLight[100],
  neutral200: neutralLight[200],
  neutral300: neutralLight[300],
  neutral400: neutralLight[400],
  neutral500: neutralLight[500],
  neutral600: neutralLight[600],
  neutral700: neutralLight[700],
  neutral800: neutralLight[800],
  neutral900: neutralLight[900],
  primary50: primaryLight[50],
  primary100: primaryLight[100],
  primary200: primaryLight[200],
  primary300: primaryLight[300],
  primary400: primaryLight[400],
  primary500: primaryLight[500],
  primary600: primaryLight[600],
  primary700: primaryLight[700],
  primary800: primaryLight[800],
  primary900: primaryLight[900],
  secondary100: secondaryLight[100],
  secondary200: secondaryLight[200],
  secondary300: secondaryLight[300],
  secondary400: secondaryLight[400],
  secondary500: secondaryLight[500],
  secondary600: secondaryLight[600],
  secondary700: secondaryLight[700],
  secondary800: secondaryLight[800],
  secondary900: secondaryLight[900],
  error500: '#b41340',
  success500: '#10b981',
} as const;

export const spacing = {
  lg: 24,
  md: 16,
  sm: 12,
  xl: 32,
  xs: 8,
} as const;

export type SpacingKey = keyof typeof spacing;

export const radius = {
  full: 9999,
  lg: 24,
  md: 12,
  sm: 4,
} as const;

export const fonts = {
  inter: {
    bold: 'interSemiBold',
    medium: 'interMedium',
    normal: 'interRegular',
    semiBold: 'interSemiBold',
  },
  monospace: {
    normal: 'monospace',
  },
  plusJakartaSans: {
    bold: 'plusJakartaSansSemiBold',
    medium: 'plusJakartaSansMedium',
    normal: 'plusJakartaSansRegular',
    semiBold: 'plusJakartaSansSemiBold',
  },
} as const;

export const fontSize = {
  '2xs': 11,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  base: 16,
  lg: 18,
  md: 15,
  sm: 14,
  xl: 20,
  xs: 12,
} as const;
