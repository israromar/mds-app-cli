import { Pressable } from 'react-native';

import { Row, Text } from '@/components/ui';

import { cn } from '@/utils/cn';

type AuthFooterLinkProps = {
  readonly label: string;
  readonly linkText: string;
  readonly onPress: () => void;
};

/**
 * A standardized footer link component for authentication screens.
 * Displays a descriptive label followed by a clickable link text.
 */
import { useResponsive } from '@/theme/responsive';

export function AuthFooterLink({
  label,
  linkText,
  onPress,
}: AuthFooterLinkProps) {
  const { isTablet } = useResponsive();
  const fontSize = isTablet ? 'text-lg' : 'text-[15px]';

  return (
    <Row className="flex-wrap items-center justify-center gap-1.5">
      <Text className={cn('text-center text-muted', fontSize)}>{label}</Text>
      <Pressable hitSlop={8} onPress={onPress}>
        <Text className={cn('font-plusJakartaSansBold text-tint', fontSize)}>
          {linkText}
        </Text>
      </Pressable>
    </Row>
  );
}
