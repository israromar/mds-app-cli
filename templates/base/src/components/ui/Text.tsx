import type { TextProps as RNTextProps } from 'react-native';

import { Text as RNText } from 'react-native';

import { cn } from '@/utils/cn';

export type TextVariant = 'body' | 'caption' | 'hero' | 'label' | 'title';

const variants: Record<TextVariant, string> = {
  body: 'font-plusJakartaSansRegular text-base text-foreground',
  caption: 'font-plusJakartaSansRegular text-sm text-muted',
  hero: 'font-interBold text-4xl leading-tight tracking-tight text-foreground',
  label: 'font-plusJakartaSansSemiBold text-sm text-foreground',
  title: 'font-interSemiBold text-3xl tracking-tight text-foreground',
};

export type UiTextProps = {
  readonly variant?: TextVariant;
} & RNTextProps;

export function Text({ className, variant = 'body', ...props }: UiTextProps) {
  return <RNText className={cn(variants[variant], className)} {...props} />;
}
