import type { ViewProps } from 'react-native';

import { View } from 'react-native';

import { cn } from '@/utils/cn';

export type DividerProps = ViewProps;

export function Divider({ className, ...props }: DividerProps) {
  return <View className={cn('h-px w-full bg-border', className)} {...props} />;
}
