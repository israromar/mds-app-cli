import type { ReactNode } from 'react';
import type { PressableProps } from 'react-native';

import { ActivityIndicator, Pressable } from 'react-native';

import { gradients, palette } from '@/theme';

import { cn } from '@/utils/cn';

import { LinearGradient } from './linear-gradient';
import { Text } from './Text';

export type ButtonVariant = 'ghost' | 'gradient' | 'outline' | 'primary';

const variants: Record<Exclude<ButtonVariant, 'gradient'>, string> = {
  ghost: 'bg-transparent active:opacity-70',
  outline: 'border border-border bg-transparent active:bg-neutral-200',
  primary: 'bg-tint active:opacity-90',
};

const labelVariants: Record<Exclude<ButtonVariant, 'gradient'>, string> = {
  ghost: 'text-tint',
  outline: 'text-foreground',
  primary: 'text-white',
};

export type ButtonProps = {
  readonly children: ReactNode;
  readonly gradientColors?: readonly string[];
  readonly gradientEnd?: [number, number];
  readonly gradientStart?: [number, number];
  readonly loading?: boolean;
  readonly textClassName?: string;
  readonly variant?: ButtonVariant;
} & Omit<PressableProps, 'children'>;

const DEFAULT_GRADIENT_START: [number, number] = [0, 1];
const DEFAULT_GRADIENT_END: [number, number] = [1, 0];

import { useResponsive } from '@/theme/responsive';

export function Button({
  children,
  className,
  disabled,
  loading = false,
  variant = 'primary',
  textClassName = undefined,
  gradientColors = undefined,
  gradientStart = DEFAULT_GRADIENT_START,
  gradientEnd = DEFAULT_GRADIENT_END,
  ...props
}: ButtonProps) {
  const busy = loading || disabled;
  const { isTablet } = useResponsive();

  // Use explicit gradientColors if provided, otherwise fallback to primary gradient if variant is 'gradient'
  const colors =
    gradientColors ??
    (variant === 'gradient' ? [...gradients.primary] : undefined);
  const hasGradient = !!colors && colors.length > 0;

  const content = loading ? (
    <ActivityIndicator
      color={
        variant === 'primary' || hasGradient
          ? palette.neutral[100]
          : palette.primary[500]
      }
      size={isTablet ? 'large' : 'small'}
    />
  ) : typeof children === 'string' ? (
    <Text
      className={cn(
        'font-plusJakartaSansMedium',
        isTablet ? 'text-lg' : 'text-base',
        hasGradient
          ? 'text-white'
          : labelVariants[variant as Exclude<ButtonVariant, 'gradient'>],
        textClassName,
      )}
    >
      {children}
    </Text>
  ) : (
    children
  );

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'items-center justify-center rounded-2xl',
        isTablet ? 'h-[64px] px-8' : 'h-[52px] px-6',
        !hasGradient && variants[variant as Exclude<ButtonVariant, 'gradient'>],
        busy && 'opacity-50',
        className,
      )}
      disabled={busy}
      {...props}
    >
      {hasGradient ? (
        <LinearGradient
          className="absolute inset-0 items-center justify-center rounded-2xl"
          colors={colors}
          end={gradientEnd}
          start={gradientStart}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </Pressable>
  );
}
