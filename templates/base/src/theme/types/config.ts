import type { Theme as NavigationTheme } from '@react-navigation/native';

import type generateConfig from '@/theme/ThemeProvider/generateConfig';

export type FulfilledThemeConfiguration = {
  readonly backgrounds: Record<string, string>;
  borders: {
    readonly colors: Record<string, string>;
    radius: readonly number[];
    widths: readonly number[];
  };
  readonly colors: Record<string, string>;
  fonts: {
    readonly colors: Record<string, string>;
    sizes: readonly number[];
  };
  gutters: readonly number[];
  readonly navigationColors: NavigationTheme['colors'];
};

export type ThemeConfiguration = FulfilledThemeConfiguration;

export type ThemeState = {
  variant: Variant;
};

export type UnionConfiguration = ReturnType<typeof generateConfig>;

export type Variant = 'default';
