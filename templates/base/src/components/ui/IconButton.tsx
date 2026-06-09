import type { PressableProps } from 'react-native';

import { Pressable } from 'react-native';

import { spacing } from '@/theme';

import { cn } from '@/utils/cn';

export type IconButtonProps = {
  readonly accessibilityLabel: string;
} & PressableProps;

export function IconButton({
  accessibilityLabel,
  children,
  className,
  hitSlop = spacing.sm,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className={cn(
        'size-[44px] items-center justify-center rounded-full active:bg-neutral-200',
        className,
      )}
      hitSlop={hitSlop}
      {...props}
    >
      {children}
    </Pressable>
  );
}
