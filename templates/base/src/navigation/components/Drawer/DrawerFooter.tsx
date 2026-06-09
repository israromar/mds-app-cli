import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

import { Box, HStack, Text, VStack } from '@/components/ui';

import { APP_CONFIG } from '@/constants/app';

export function DrawerFooter() {
  const { t } = useTranslation();

  return (
    <Box className="bg-neutral-50/50 px-8 py-6">
      <HStack className="items-center justify-between">
        <VStack>
          <Text className="text-[10px] font-interBold text-neutral-400 uppercase tracking-wider">
            {t('app:nav.drawer_tagline')}
          </Text>
          <Text className="text-[10px] font-plusJakartaSansMedium text-neutral-300">
            {APP_CONFIG.version}
          </Text>
        </VStack>
        <Image
          className="h-5 w-5 opacity-20 grayscale"
          contentFit="contain"
          source={APP_CONFIG.logo}
        />
      </HStack>
    </Box>
  );
}
