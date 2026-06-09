import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { palette, tailwindColors } from '@/theme';
import { useResponsive } from '@/theme/responsive';

import { Column, Row, Text } from '@/components/ui';

import { cn } from '@/utils/cn';

type OtpInputProps = {
  readonly autoFocus?: boolean;
  readonly code: string;
  readonly error?: string;
  readonly label?: string;
  readonly onCodeChange: (code: string) => void;
};

const OTP_KEYS = [
  'otp-0',
  'otp-1',
  'otp-2',
  'otp-3',
  'otp-4',
  'otp-5',
] as const;

export function OtpInput({
  autoFocus = true,
  code,
  error = undefined,
  label = undefined,
  onCodeChange,
}: OtpInputProps) {
  const { isTablet } = useResponsive();
  const [isFocused, setIsFocused] = useState(autoFocus);
  const inputReference = useRef<TextInput>(null);

  const length = 6;
  // eslint-disable-next-line @typescript-eslint/no-misused-spread
  const digits = [...code]; // NOSONAR

  const handlePress = () => {
    inputReference.current?.focus();
  };

  return (
    <Column className={isTablet ? 'gap-2.5' : 'gap-1.5'}>
      {label ? (
        <Row className="items-center justify-between px-0.5 mb-2">
          <Text
            className={cn('font-semibold', isTablet ? 'text-lg' : 'text-md')}
            variant="label"
          >
            {label}
          </Text>
        </Row>
      ) : null}

      {/* Invisible real text input to capture keyboards and clipboard pasting */}
      <TextInput
        autoComplete="one-time-code"
        autoFocus={autoFocus}
        caretHidden
        className="absolute w-1 h-1 opacity-0"
        keyboardType="number-pad"
        maxLength={length}
        onBlur={() => setIsFocused(false)}
        onChangeText={(text) => {
          // Only allow digits
          const cleaned = text.replaceAll(/\D/g, '');
          onCodeChange(cleaned);
        }}
        onFocus={() => setIsFocused(true)}
        ref={inputReference}
        style={StyleSheet.absoluteFill}
        textContentType="oneTimeCode"
        value={code}
      />

      <Pressable
        className="w-full flex-row justify-between items-center"
        onPress={handlePress}
      >
        {OTP_KEYS.map((key, index) => {
          const digit = digits[index] ?? '';
          const isCurrent = index === digits.length;
          const isLast = index === length - 1;
          const isCodeFull = digits.length === length;
          const isBoxFocused =
            isFocused && (isCurrent || (isLast && isCodeFull));

          return (
            <View
              className={cn(
                'flex-1 items-center justify-center bg-white border rounded-2xl mx-1 transition-all duration-150',
                isTablet ? 'h-20 aspect-square' : 'h-14 aspect-square',
              )}
              key={key}
              style={{
                borderColor: error
                  ? tailwindColors.error
                  : isBoxFocused
                    ? palette.primary[500]
                    : palette.neutral[300],
                borderWidth: isBoxFocused ? 2 : 1,
                // Add soft elegant shadows to focused boxes
                shadowColor: isBoxFocused
                  ? palette.primary[500]
                  : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isBoxFocused ? 0.15 : 0,
                shadowRadius: 8,
                elevation: isBoxFocused ? 3 : 0,
              }}
            >
              <Text
                className={cn(
                  'font-headline text-center font-bold text-foreground',
                  isTablet ? 'text-3xl' : 'text-2xl',
                )}
              >
                {digit}
              </Text>

              {/* Blinking cursor effect inside active box */}
              {isBoxFocused && !digit ? (
                <View
                  className="absolute w-0.5 h-6 bg-primary-500 rounded-full animate-pulse"
                  style={{
                    backgroundColor: palette.primary[500],
                  }}
                />
              ) : null}
            </View>
          );
        })}
      </Pressable>

      {error ? (
        <Text
          className={cn(
            'px-1 mt-2 font-body text-error animate-fade-in',
            isTablet ? 'text-[14px]' : 'text-[12px]',
          )}
        >
          {error}
        </Text>
      ) : null}
    </Column>
  );
}
