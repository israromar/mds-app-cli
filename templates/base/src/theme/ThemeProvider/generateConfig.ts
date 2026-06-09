import { config } from '@/theme/_config';
import type { FulfilledThemeConfiguration } from '@/theme/types/config';

const buildConfig = () => {
  const { backgrounds, borders, colors, fonts, gutters, navigationColors } =
    config;

  return {
    backgrounds,
    borders: {
      colors: borders.colors,
      radius: borders.radius,
      widths: borders.widths,
    },
    colors,
    fonts,
    gutters,
    navigationColors,
  } as const satisfies FulfilledThemeConfiguration;
};

export default buildConfig;
