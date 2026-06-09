import type { ReactNode } from 'react';

import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

import { palette } from '@/theme';

import { IconButton } from './IconButton';
import { Box, HStack } from './layout';
import { Text } from './Text';

export type SubHeaderProps = {
  readonly onBack?: () => void;
  readonly rightElement?: ReactNode;
  readonly title: string;
};

export function SubHeader({
  title,
  onBack = undefined,
  rightElement = undefined,
}: SubHeaderProps) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <Box className="bg-white px-6 py-4 border-b border-neutral-100 z-50">
      <HStack className="items-center justify-between">
        <IconButton
          accessibilityLabel="Go back"
          className="bg-neutral-50 h-10 w-10 active:bg-neutral-100"
          onPress={handleBack}
        >
          <ChevronLeft color={palette.neutral[900]} size={20} />
        </IconButton>
        <Text className="font-interBold text-lg text-neutral-900">{title}</Text>
        {rightElement ? (
          <Box className="min-w-10 items-end">{rightElement}</Box>
        ) : (
          <Box className="w-10" />
        )}
      </HStack>
    </Box>
  );
}
