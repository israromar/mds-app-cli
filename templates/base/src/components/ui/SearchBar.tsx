import type { TextInputProps } from 'react-native';

import { Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Platform, TextInput, View } from 'react-native';

import { palette } from '@/theme';

import { cn } from '@/utils/cn';

export type SearchBarProps = {
  readonly containerClassName?: string;
} & TextInputProps;

const SEARCH_BAR_HEIGHT = 48;

const inputPlatformStyle = Platform.select({
  android: { paddingVertical: 0, textAlignVertical: 'center' as const },
  default: { paddingVertical: 0 },
});

/**
 * A reusable search bar component with an icon.
 */
export function SearchBar({
  containerClassName = undefined,
  placeholder,
  ...props
}: SearchBarProps) {
  const { t } = useTranslation();
  const resolvedPlaceholder =
    placeholder ?? t('app:components.search_placeholder');

  return (
    <View
      className={cn(
        'flex-row items-center bg-white rounded-2xl px-4 border border-neutral-100 shadow-sm',
        containerClassName,
      )}
      style={{ height: SEARCH_BAR_HEIGHT }}
    >
      <Search color={palette.neutral[400]} size={20} />
      <TextInput
        className="flex-1 ml-3 font-plusJakartaSansMedium text-base text-neutral-900"
        placeholder={resolvedPlaceholder}
        placeholderTextColor={palette.neutral[400]}
        style={inputPlatformStyle}
        {...props}
      />
    </View>
  );
}
