import { Image } from 'expo-image';
import { ArrowRight, MapPin } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { palette } from '@/theme';

import { Box, HStack, VStack } from './layout';
import { Text } from './Text';

export type LocationCardProps = {
  readonly avatars?: string[];
  readonly isLive?: boolean;
  readonly onPress?: () => void;
  readonly showArrow?: boolean;
  readonly subtitle: string;
  readonly title: string;
  readonly totalPeople?: string;
};

/**
 * A reusable card for displaying locations with metadata and user avatars.
 */
export function LocationCard({
  avatars = undefined,
  isLive = false,
  onPress = undefined,
  showArrow = false,
  subtitle,
  title,
  totalPeople = undefined,
}: LocationCardProps) {
  return (
    <Pressable
      className="bg-white rounded-[32px] p-5 border border-neutral-50 shadow-sm active:scale-[0.98] active:bg-neutral-50"
      onPress={onPress}
    >
      <HStack className="items-center justify-between">
        <HStack className="items-center flex-1">
          <Box className="w-16 h-16 rounded-[24px] bg-neutral-100 items-center justify-center">
            <MapPin color={palette.neutral[600]} size={28} />
          </Box>
          <VStack className="ml-4 flex-1">
            <HStack className="items-center justify-between">
              <Text
                className="font-interBold text-lg text-neutral-900 pr-2 flex-1"
                numberOfLines={1}
              >
                {title}
              </Text>
              {isLive ? (
                <Box className="bg-red-50 px-3 py-1 rounded-full">
                  <Text className="text-[10px] font-interBold text-red-500 uppercase tracking-wider">
                    Live
                  </Text>
                </Box>
              ) : undefined}
            </HStack>
            <Text
              className="font-plusJakartaSansMedium text-sm text-neutral-500 mt-1"
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          </VStack>
        </HStack>
        {showArrow ? (
          <Box className="ml-2 h-10 w-10 items-center justify-center rounded-xl bg-neutral-50">
            <ArrowRight color={palette.neutral[400]} size={18} />
          </Box>
        ) : undefined}
      </HStack>

      {avatars && avatars.length > 0 ? (
        <HStack className="mt-5 items-center gap-2">
          <HStack className="flex-row items-center">
            {avatars?.map((avatar, index) => (
              <Image
                cachePolicy="memory-disk"
                className="w-9 h-9 rounded-full border-2 border-white -ml-3"
                contentFit="cover"
                key={avatar}
                source={avatar}
                style={{ zIndex: 10 - index }}
                transition={200}
              />
            ))}
            {totalPeople ? (
              <Box className="w-9 h-9 rounded-full bg-neutral-100 items-center justify-center border-2 border-white -ml-3">
                <Text className="text-[10px] font-interBold text-neutral-500">
                  {totalPeople}
                </Text>
              </Box>
            ) : undefined}
          </HStack>
          <Text className="font-plusJakartaSansSemiBold text-xs text-neutral-400">
            Current explorers
          </Text>
        </HStack>
      ) : undefined}
    </Pressable>
  );
}
