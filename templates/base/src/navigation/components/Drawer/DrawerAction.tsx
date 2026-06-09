import { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { palette, tailwindColors } from '@/theme';

import { Box, Text } from '@/components/ui';

type DrawerActionProps = {
  readonly handlePress?: () => void;
  readonly icon: LucideIcon;
  readonly isDestructive?: boolean;
  readonly label: string;
  readonly showBadge?: boolean;
};

const noop = () => {};

export function DrawerAction({
  icon: Icon,
  isDestructive = false,
  label,
  handlePress = noop,
  showBadge = false,
}: DrawerActionProps) {
  return (
    <Pressable
      className={cn(
        'flex-row items-center gap-4 px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98]',
        isDestructive ? 'active:bg-red-50' : 'active:bg-neutral-50',
      )}
      onPress={handlePress}
    >
      <Box
        className={cn(
          'h-10 w-10 items-center justify-center rounded-2xl shadow-sm relative',
          isDestructive ? 'bg-red-50' : 'bg-white border border-neutral-100',
        )}
      >
        <Icon
          color={isDestructive ? tailwindColors.error : palette.primary[500]}
          size={18}
          strokeWidth={2.5}
        />
        {showBadge ? (
          <Box className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        ) : null}
      </Box>
      <Text
        className={cn(
          'font-plusJakartaSansSemiBold text-[15px] flex-1',
          isDestructive ? 'text-error' : 'text-neutral-700',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function cn(...classes: (boolean | string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
