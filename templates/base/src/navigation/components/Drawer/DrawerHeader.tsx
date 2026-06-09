import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Paths } from '@/navigation/paths';
import { RootStackParamList } from '@/navigation/types';

import { Box, HStack, Text, UserAvatar, VStack } from '@/components/ui';

type DrawerHeaderProps = {
  readonly avatar: string;
  readonly userHandle: string;
  readonly userName: string;
};

export function DrawerHeader({
  avatar,
  userHandle,
  userName,
}: DrawerHeaderProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const openProfile = () => navigation.navigate(Paths.Profile);

  return (
    <Box className="px-5 pt-8 pb-6">
      <HStack className="items-center justify-between mb-6">
        <UserAvatar
          onPress={openProfile}
          profile={{ avatar_url: avatar, display_name: userName }}
          size="2xl"
        />
      </HStack>

      <VStack>
        <Text className="font-interBold text-2xl text-neutral-900 tracking-tight">
          {userName}
        </Text>
        {userHandle ? (
          <Text className="font-plusJakartaSansSemiBold text-sm text-primary-500">
            {userHandle}
          </Text>
        ) : undefined}
      </VStack>
    </Box>
  );
}
