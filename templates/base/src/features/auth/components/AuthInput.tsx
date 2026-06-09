import type { LucideIcon } from 'lucide-react-native';
import type { TextInputProps } from 'react-native';

import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { palette, tailwindColors } from '@/theme';

import { Column, Icon, Row, Text } from '@/components/ui';

import { cn } from '@/utils/cn';

type AuthInputProps = {
  readonly error?: string;
  readonly helper?: string;
  readonly helperTone?: 'error' | 'muted' | 'success';
  readonly icon: string;
  readonly label: string;
} & TextInputProps;

const ICON_MAP: Record<string, LucideIcon> = {
  email: Mail,
  eye: Eye,
  'eye-off': EyeOff,
  lock: Lock,
  user: User,
};

import { useResponsive } from '@/theme/responsive';

export function AuthInput({
  error = undefined,
  helper = undefined,
  helperTone = 'muted',
  icon,
  label,
  onBlur = undefined,
  onFocus = undefined,
  secureTextEntry,
  ...props
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const { isTablet } = useResponsive();

  const colors = useMemo(() => {
    const active = palette.primary[500];
    const error_ = tailwindColors.error;
    const muted = palette.neutral[400];
    const baseBorder = palette.neutral[300];

    return {
      border: error ? error_ : isFocused ? active : baseBorder,
      icon: error ? error_ : isFocused ? active : muted,
      muted,
    };
  }, [error, isFocused]);

  const IconComponent = ICON_MAP[icon] ?? User;
  const isPasswordField = secureTextEntry !== undefined;

  return (
    <Column className={isTablet ? 'gap-2.5' : 'gap-1.5'}>
      {label ? (
        <Row className="items-center justify-between px-0.5">
          <Text
            className={cn('font-semibold', isTablet ? 'text-lg' : 'text-md')}
            variant="label"
          >
            {label}
          </Text>
        </Row>
      ) : null}

      <View
        className="rounded-xl border bg-white border-width-1 mt-1 transition-all duration-200"
        style={{ borderColor: colors.border }}
      >
        <Row
          className={cn('items-center gap-md', isTablet ? 'px-lg' : 'px-md')}
        >
          <Icon
            as={IconComponent}
            color={colors.icon}
            size={isTablet ? 24 : 20}
            strokeWidth={2}
          />
          <TextInput
            className={cn(
              'flex-1 pl-0 font-plusJakartaSansMedium text-foreground',
              isTablet ? 'py-md text-lg' : 'py-sm text-md',
            )}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            placeholderTextColor={colors.muted}
            secureTextEntry={isSecure}
            {...props}
          />

          {isPasswordField ? (
            <Pressable
              className="active:opacity-60"
              hitSlop={12}
              onPress={() => setIsSecure((previous) => !previous)}
            >
              <Icon
                as={isSecure ? Eye : EyeOff}
                color={colors.muted}
                size={isTablet ? 24 : 20}
                strokeWidth={2}
              />
            </Pressable>
          ) : null}
        </Row>
      </View>

      {error ? (
        <Text
          className={cn(
            'px-1 mt-1 font-body text-error animate-fade-in',
            isTablet ? 'text-[14px]' : 'text-[12px]',
          )}
        >
          {error}
        </Text>
      ) : helper ? (
        <Text
          className={cn(
            'px-1 mt-1 font-body animate-fade-in',
            helperTone === 'success'
              ? 'text-green-600'
              : helperTone === 'error'
                ? 'text-error'
                : 'text-neutral-500',
            isTablet ? 'text-[14px]' : 'text-[12px]',
          )}
        >
          {helper}
        </Text>
      ) : null}
    </Column>
  );
}
