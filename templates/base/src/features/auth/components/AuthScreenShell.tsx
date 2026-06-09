import type { ReactNode } from 'react';

import { useNavigation } from '@react-navigation/native';
import { ChevronLeftIcon } from 'lucide-react-native';
import { type ViewStyle } from 'react-native';
import { Pressable, View } from 'react-native';
import { KeyboardToolbar } from 'react-native-keyboard-controller';

import { useTheme } from '@/theme';
import { useResponsive } from '@/theme/responsive';

import { FtueDecorativeBackground } from '@/components/ftue';
import { SafeScreen } from '@/components/templates';
import { Column, Icon, Row, Screen, Text } from '@/components/ui';

import { APP_CONFIG } from '@/constants/app';
import { cn } from '@/utils/cn';

type Properties = {
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly showBack?: boolean;
  readonly subtitle?: string;
  readonly title: string;
};

export function AuthScreenShell({
  children,
  footer = undefined,
  showBack = true,
  subtitle = undefined,
  title,
}: Properties) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { isTablet, isLargeTablet, formMaxWidth, height } = useResponsive();
  const { name } = APP_CONFIG;

  const tabletContentStyle: undefined | ViewStyle = isTablet
    ? {
        alignSelf: 'center',
        width: '100%',
        maxWidth: isLargeTablet ? 1200 : 1000,
      }
    : undefined;

  return (
    <SafeScreen edges={[]}>
      <View className="relative flex-1">
        <FtueDecorativeBackground />
        <Screen
          className="flex-1 bg-transparent"
          contentContainerStyle={{
            justifyContent: isTablet ? 'center' : 'flex-start',
            minHeight: isTablet ? height - 100 : undefined,
          }}
          safeAreaEdges={['bottom', 'left', 'right', 'top']}
          scroll
        >
          <View className={cn('flex-1 py-4', isTablet ? 'px-16' : 'px-4')}>
            <Column className="w-full flex-1" style={tabletContentStyle}>
              <Column
                className={cn(
                  isTablet ? 'px-12 pb-16 pt-8' : 'px-5 pb-6 pt-4',
                  'flex-1',
                )}
              >
                <Row
                  className={cn('items-center', isTablet ? 'py-10' : 'py-6')}
                >
                  <View className="flex-1 items-start">
                    {showBack ? (
                      <Pressable
                        hitSlop={12}
                        onPress={() => {
                          navigation.goBack();
                        }}
                      >
                        <Row className="items-center gap-1.5">
                          <Icon
                            as={ChevronLeftIcon}
                            color={colors.primary500}
                            size={isTablet ? 40 : 32}
                          />
                        </Row>
                      </Pressable>
                    ) : undefined}
                  </View>

                  <Row className="items-center justify-center py-4">
                    <Row className="items-center gap-2.5">
                      <Text
                        className={cn(
                          'font-headline font-black tracking-tighter text-primary-500',
                          isTablet ? 'text-5xl' : 'text-3xl',
                        )}
                      >
                        {name}
                      </Text>
                      <View
                        className={cn(
                          'bg-secondary-500 rounded-full mt-2',
                          isTablet ? 'w-4 h-4' : 'w-2 h-2',
                        )}
                      />
                    </Row>
                  </Row>

                  <View className="flex-1" />
                </Row>

                <Column
                  className={cn('gap-12 flex-1', isTablet ? 'mt-16' : 'mt-8')}
                >
                  <Column className="items-center gap-6">
                    <Text
                      className={cn(
                        'text-center font-extrabold tracking-tighter',
                        isLargeTablet
                          ? 'text-5xl'
                          : isTablet
                            ? 'text-4xl'
                            : 'text-3xl',
                      )}
                      variant="hero"
                    >
                      {title}
                    </Text>
                    {subtitle ? (
                      <Text
                        className={cn(
                          'text-center text-muted max-w-2xl',
                          isTablet ? 'text-2xl leading-relaxed' : 'text-base',
                        )}
                        variant="body"
                      >
                        {subtitle}
                      </Text>
                    ) : undefined}
                  </Column>

                  <KeyboardToolbar.Group>
                    <Column
                      className="gap-8 w-full mx-auto"
                      style={{ maxWidth: formMaxWidth }}
                    >
                      {children}
                    </Column>
                  </KeyboardToolbar.Group>
                </Column>

                {footer ? (
                  <Column
                    className={cn(
                      'items-center',
                      isTablet ? 'pt-24 pb-12' : 'pt-8 pb-4',
                    )}
                  >
                    {footer}
                  </Column>
                ) : undefined}
              </Column>
            </Column>
          </View>
        </Screen>
      </View>
    </SafeScreen>
  );
}
