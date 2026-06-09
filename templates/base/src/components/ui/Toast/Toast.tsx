import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  type LucideIcon,
} from 'lucide-react-native';
import { useEffect, useMemo } from 'react';
import { Animated, Text, View } from 'react-native';
import { useKeyboardState } from 'react-native-keyboard-controller';

import { spacing } from '@/theme';

const BASE_BOTTOM = spacing.xl + spacing.md;

export type ToastMessage = {
  readonly description?: string;
  readonly duration?: number;
  /**
   * Bumped on every `showToast` call so the same title fired twice in a row
   * still re-triggers the show / hide animation.
   */
  readonly key: number;
  readonly title: string;
  readonly type?: ToastType;
};

export type ToastType = 'error' | 'info' | 'success' | 'warning';

type ToastProps = {
  readonly message: null | ToastMessage;
  readonly onHide: () => void;
};

const DEFAULT_DURATION = 2200;

const TYPE_CONFIG: Record<ToastType, { color: string; icon: LucideIcon }> = {
  error: { color: '#F87171', icon: AlertCircle },
  info: { color: '#60A5FA', icon: Info },
  success: { color: '#4ADE80', icon: CheckCircle2 },
  warning: { color: '#FBBF24', icon: AlertTriangle },
};

/**
 * Compact, auto-dismissing pill that fades in near the bottom of the screen.
 * Driven by `message`: setting it to a new value triggers a fresh show / hide
 * cycle and `onHide` fires once the exit animation completes. Mount once at
 * the screen root via `ToastProvider`.
 */
export function Toast({ message, onHide }: ToastProps) {
  const opacity = useMemo(() => new Animated.Value(0), []);
  const translateY = useMemo(() => new Animated.Value(8), []);
  const keyboard = useKeyboardState();
  // Lift the toast above the keyboard when it's open so copy/confirmation
  // toasts aren't hidden behind it (e.g. copying a message from the chat).
  const keyboardOffset = keyboard?.isVisible ? (keyboard.height ?? 0) : 0;

  useEffect(() => {
    if (!message) return;

    opacity.setValue(0);
    translateY.setValue(8);

    const visibleFor = message.duration ?? DEFAULT_DURATION;
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(visibleFor),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 8,
          duration: 220,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start(({ finished }) => {
      if (finished) onHide();
    });

    return () => animation.stop();
  }, [message, opacity, translateY, onHide]);

  if (!message) return null;

  const config = TYPE_CONFIG[message.type ?? 'info'];
  const IconComponent = config.icon;

  return (
    <Animated.View
      className="absolute left-0 right-0 items-center"
      pointerEvents="box-none"
      style={{
        bottom: BASE_BOTTOM + keyboardOffset,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <View className="max-w-[88%] flex-row items-center gap-3 rounded-3xl bg-[#0F172AEB] px-4 py-2.5">
        <View className="h-[18px] w-[18px] items-center justify-center">
          <IconComponent color={config.color} size={18} strokeWidth={3} />
        </View>
        <View className="shrink">
          <Text
            className="font-plusJakartaSansSemiBold text-sm leading-[18px] text-white"
            numberOfLines={3}
          >
            {message.title}
          </Text>
          {message.description ? (
            <Text
              className="mt-0.5 font-plusJakartaSansMedium text-xs leading-4 text-white/65"
              numberOfLines={3}
            >
              {message.description}
            </Text>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}
