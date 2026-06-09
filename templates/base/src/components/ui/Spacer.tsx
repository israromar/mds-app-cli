import type { ViewProps } from 'react-native';

import { View } from 'react-native';

import type { SpacingKey } from '@/theme';

import { cn } from '@/utils/cn';

const heights: Record<SpacingKey, string> = {
  lg: 'h-lg',
  md: 'h-md',
  sm: 'h-sm',
  xl: 'h-xl',
  xs: 'h-xs',
};

const widths: Record<SpacingKey, string> = {
  lg: 'w-lg',
  md: 'w-md',
  sm: 'w-sm',
  xl: 'w-xl',
  xs: 'w-xs',
};

export type SpacerProps = {
  readonly axis?: 'horizontal' | 'vertical';
  readonly size?: SpacingKey;
} & ViewProps;

export function Spacer({
  axis = 'vertical',
  className,
  size = 'xs',
  ...props
}: SpacerProps) {
  const dimensionClass = axis === 'vertical' ? heights[size] : widths[size];

  return <View className={cn(dimensionClass, className)} {...props} />;
}
