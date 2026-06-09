import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Menu } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { palette } from '@/theme';

import { APP_CONFIG } from '@/constants/app';

import { IconButton } from './IconButton';
import { Box, HStack } from './layout';
import { Text } from './Text';

/**
 * Standard app header with logo, name, and menu toggle.
 */
export function MainHeader() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Box className="bg-white border-b border-neutral-100 z-50">
      <HStack className="items-center justify-between px-6 py-4">
        <HStack className="items-center gap-2">
          <Box className="w-8 h-8 rounded-xl bg-primary-50 items-center justify-center">
            <Image
              className="w-12 h-12"
              contentFit="contain"
              source={APP_CONFIG.logo}
            />
          </Box>
          <Text className="font-interBold text-2xl ml-2 text-neutral-900">
            {APP_CONFIG.name}
          </Text>
        </HStack>

        <IconButton
          accessibilityLabel={t('app:components.open_menu')}
          className="w-10 h-10 rounded-xl bg-neutral-50 active:bg-neutral-100"
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <Menu color={palette.neutral[900]} size={22} />
        </IconButton>
      </HStack>
    </Box>
  );
}
