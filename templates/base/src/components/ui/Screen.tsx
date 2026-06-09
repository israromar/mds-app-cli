import type { ReactNode } from 'react';
import type { ScrollViewProps, ViewProps } from 'react-native';

import { View } from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';

import { useSafeArea } from '@/hooks/useSafeArea';
import { spacing } from '@/theme';

import { cn } from '@/utils/cn';

import { TabBarSpacer } from './TabBarSpacer';

export type ScreenProps =
  | ({ readonly scroll: true } & Omit<ScrollViewProps, 'children'> & ScreenBase)
  | ({ readonly scroll?: false } & Omit<ViewProps, 'children'> & ScreenBase);

type ScreenBase = {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly header?: ReactNode;
  /** When false, children manage keyboard insets (e.g. KeyboardStickyView). */
  readonly keyboardAvoiding?: boolean;
  readonly keyboardOffset?: number;
  readonly safeAreaEdges?: ('bottom' | 'left' | 'right' | 'top')[];
  readonly withTabBar?: boolean;
};

export function Screen({
  children,
  className,
  header,
  keyboardAvoiding = true,
  keyboardOffset = 0,
  safeAreaEdges = ['top', 'bottom', 'left', 'right'] as (
    | 'bottom'
    | 'left'
    | 'right'
    | 'top'
  )[],
  scroll = false,
  withTabBar = false,
  ...rest
}: ScreenProps) {
  const insets = useSafeArea();
  const hasEdge = (edge: 'bottom' | 'left' | 'right' | 'top') =>
    safeAreaEdges.includes(edge);

  const paddingStyle = {
    paddingLeft: hasEdge('left') ? insets.left : 0,
    paddingRight: hasEdge('right') ? insets.right : 0,
    paddingTop: hasEdge('top') ? Math.max(insets.top, spacing.sm) : 0,
  };

  const scrollPaddingStyle = {
    paddingBottom:
      !withTabBar && hasEdge('bottom')
        ? Math.max(insets.bottom, spacing.sm)
        : 0,
  };

  const layoutClass = cn('flex-1 bg-background', className);

  if (scroll) {
    const {
      contentContainerStyle: userContentContainerStyle,
      style: userStyle,
      ...scrollRest
    } = rest as ScrollViewProps;

    return (
      <View className="flex-1">
        {header}
        <KeyboardAwareScrollView
          bottomOffset={keyboardOffset || 50}
          className={layoutClass}
          contentContainerStyle={[
            { flexGrow: 1 },
            paddingStyle,
            scrollPaddingStyle,
            userContentContainerStyle,
          ]}
          contentInsetAdjustmentBehavior="never"
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          style={userStyle}
          {...scrollRest}
        >
          {children}
          {withTabBar ? <TabBarSpacer /> : null}
        </KeyboardAwareScrollView>
      </View>
    );
  }

  const content = (
    <View
      className={layoutClass}
      style={[
        paddingStyle,
        scrollPaddingStyle,
        (rest as ViewProps).style,
        withTabBar ? { paddingBottom: 0 } : {},
      ]}
      {...rest}
    >
      {children}
    </View>
  );

  if (!keyboardAvoiding) {
    return (
      <View className="flex-1">
        {header}
        {content}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1"
      keyboardVerticalOffset={keyboardOffset}
    >
      {header}
      {content}
    </KeyboardAvoidingView>
  );
}
