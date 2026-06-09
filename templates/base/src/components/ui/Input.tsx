/* eslint-disable react/require-default-props -- optional NativeWind className */
import type { TextInputProps } from 'react-native';

import { forwardRef } from 'react';
import { TextInput } from 'react-native';

import { cn } from '@/utils/cn';

export type InputProps = {
  readonly className?: string;
} & TextInputProps;

export const Input = forwardRef<TextInput, InputProps>(
  (
    { className = undefined, placeholderTextColor = '#9CA3AF', ...props },
    reference,
  ) => {
    return (
      <TextInput
        className={cn(
          'min-h-[52px] rounded-2xl border border-neutral-300 bg-neutral-200 px-md py-md font-plusJakartaSansRegular text-base text-foreground',
          className,
        )}
        placeholderTextColor={placeholderTextColor}
        ref={reference}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
