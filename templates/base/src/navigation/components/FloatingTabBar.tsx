import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/theme';

import { Box, HStack, VStack } from '@/components/ui';

import { TAB_BAR_BASE_OFFSET, TAB_BAR_HEIGHT } from '@/constants/navigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_WIDTH = Math.min(SCREEN_WIDTH * 0.92, 420);

type TabItemProps = {
  readonly badgeCount?: number;
  readonly icon: (props: {
    readonly color: string;
    readonly size: number;
  }) => React.ReactNode;
  readonly isFocused: boolean;
  readonly label: string;
  readonly onPress: () => void;
};

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const bottomOffset = Math.max(insets.bottom - 6, 16) + TAB_BAR_BASE_OFFSET;

  return (
    <Box
      className="absolute left-0 right-0 items-center justify-center pointer-events-box-none"
      style={{ bottom: bottomOffset }}
    >
      <Box
        className="bg-white rounded-[32px] border border-neutral-100"
        style={{
          width: TAB_BAR_WIDTH,
          height: TAB_BAR_HEIGHT,
          shadowColor: '#0B1220',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 12,
        }}
      >
        <HStack className="flex-1 items-center px-2">
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel ?? options.title ?? route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TabItem
                icon={
                  options.tabBarIcon as (props: {
                    readonly color: string;
                    readonly size: number;
                  }) => React.ReactNode
                }
                isFocused={isFocused}
                key={route.key}
                label={label as string}
                onPress={onPress}
              />
            );
          })}
        </HStack>
      </Box>
    </Box>
  );
}

function cn(...classes: (boolean | string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function TabItem({
  icon: Icon,
  isFocused,
  label,
  onPress,
  badgeCount = undefined,
}: TabItemProps) {
  const { t } = useTranslation();
  const resolvedLabel = label.startsWith('app:') ? t(label) : label;
  const iconColor = isFocused ? palette.primary[600] : palette.neutral[500];

  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: isFocused ? palette.primary[50] : 'transparent',
    transform: [
      {
        scale: withSpring(isFocused ? 1 : 0.92, {
          damping: 18,
          stiffness: 260,
        }),
      },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused ? 1 : 0.7, { duration: 180 }),
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      className="flex-1 items-center justify-center py-2"
      onPress={onPress}
    >
      <VStack className="items-center gap-1">
        <Animated.View
          style={[
            {
              alignItems: 'center',
              borderRadius: 18,
              justifyContent: 'center',
              paddingHorizontal: 18,
              paddingVertical: 6,
            },
            pillStyle,
          ]}
        >
          <Box className="relative">
            <Icon color={iconColor} size={22} />
            {badgeCount && badgeCount > 0 ? (
              <Box
                className="absolute bg-blue-600 rounded-full"
                style={{
                  top: -1,
                  right: -2,
                  width: 9,
                  height: 9,
                  borderRadius: 4.5,
                  borderWidth: 1.5,
                  borderColor: '#FFFFFF',
                }}
              />
            ) : null}
          </Box>
        </Animated.View>
        <Animated.Text
          className={cn(
            'text-[11px]',
            isFocused
              ? 'font-interBold text-primary-600'
              : 'font-plusJakartaSansMedium text-neutral-500',
          )}
          style={labelStyle}
        >
          {resolvedLabel}
        </Animated.Text>
      </VStack>
    </Pressable>
  );
}
