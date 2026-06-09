import React from 'react';
import { DimensionValue, View, ViewProps } from 'react-native';

import { cn } from '@/utils/cn';

type ContainerProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly maxWidth?: DimensionValue;
} & ViewProps;

/**
 * A layout component that constrains the width of its children on large screens.
 * Useful for maintaining a readable layout on iPads and tablets.
 */
export function Container({
  children,
  className = undefined,
  maxWidth = undefined,
  style,
  ...props
}: ContainerProps) {
  return (
    <View
      className={cn('w-full self-center', className)}
      style={[maxWidth ? { maxWidth } : {}, style]}
      {...props}
    >
      {children}
    </View>
  );
}
