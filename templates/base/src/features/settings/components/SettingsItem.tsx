import { ChevronRight } from 'lucide-react-native';
import { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { palette } from '@/theme';

import { Text } from '@/components/ui';

type SettingsItemProps = {
  readonly icon: ReactNode;
  readonly iconBgColor?: string;
  readonly isLast?: boolean;
  readonly label: string;
  readonly onPress?: () => void;
  readonly rightElement?: ReactNode;
};

export function SettingsItem({
  icon,
  label,
  onPress = undefined,
  iconBgColor = palette.primary[50],
  isLast = false,
  rightElement = undefined,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`flex-row items-center justify-between py-4 ${
        isLast ? '' : 'border-b border-neutral-100'
      }`}
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <View
          className="h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </View>
        <Text className="ml-4 text-base font-medium text-neutral-800">
          {label}
        </Text>
      </View>

      <View className="flex-row items-center">
        {rightElement}
        <ChevronRight color={palette.neutral[300]} size={20} />
      </View>
    </TouchableOpacity>
  );
}
