import {
  Modal as GSModal,
  ModalBackdrop,
  ModalContent,
} from '@gluestack-ui/themed';
import { BlurView } from '@react-native-community/blur';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';
import { useResponsive } from '@/theme/responsive';

import { isIOS } from '@/utils';
import { cn } from '@/utils/cn';

import { Button } from '../Button';
import { VStack as Column } from '../layout';
import { Text } from '../Text';

type ModalProps = {
  readonly children?: React.ReactNode;
  readonly description?: string;
  readonly isVisible: boolean;
  readonly onClose: () => void;
  readonly onPrimaryButtonPress?: () => void;
  readonly onSecondaryButtonPress?: () => void;
  readonly primaryButtonText?: string;
  readonly secondaryButtonText?: string;
  readonly size?: 'full' | 'lg' | 'md' | 'sm' | 'xs';
  readonly title?: string;
  readonly type?: 'default' | 'error' | 'success';
};

export function Modal({
  children = undefined,
  description = '',
  isVisible,
  onClose,
  onPrimaryButtonPress = undefined,
  onSecondaryButtonPress = undefined,
  primaryButtonText = undefined,
  secondaryButtonText = undefined,
  size = 'md',
  title = '',
  type = 'default',
}: ModalProps) {
  const { isTablet } = useResponsive();
  const { colors } = useTheme();

  const getIcon = () => {
    const size = isTablet ? 40 : 32;
    switch (type) {
      case 'error': {
        return (
          <AlertCircle color={colors.error500} size={size} strokeWidth={2.5} />
        );
      }
      case 'success': {
        return (
          <CheckCircle2
            color={colors.success500}
            size={size}
            strokeWidth={2.5}
          />
        );
      }
      default: {
        return <Info color={colors.primary500} size={size} strokeWidth={2.5} />;
      }
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'error': {
        return 'bg-error/10';
      }
      case 'success': {
        return 'bg-success/10';
      }
      default: {
        return 'bg-primary-500/10';
      }
    }
  };

  return (
    <GSModal isOpen={isVisible} onClose={onClose} size={size}>
      {children ?? (
        <>
          <ModalBackdrop className="bg-black/40">
            <BlurView
              blurAmount={15}
              blurType="dark"
              style={StyleSheet.absoluteFill}
            />
          </ModalBackdrop>

          <ModalContent
            className={cn(
              'rounded-[48px] overflow-hidden bg-white/60 shadow-2xl border border-white/40',
              isTablet ? 'w-[600px]' : 'w-[90%] max-w-[420px]',
            )}
          >
            <BlurView
              blurAmount={40}
              blurType={isIOS ? 'xlight' : 'light'}
              style={StyleSheet.absoluteFill}
            />

            <Column
              className={cn(
                'relative overflow-hidden',
                isTablet ? 'p-12' : 'p-8',
              )}
            >
              {/* Close Button */}
              <Pressable
                className="absolute right-6 top-6 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/5 active:bg-black/10"
                hitSlop={12}
                onPress={onClose}
              >
                <X color={colors.neutral400} size={20} strokeWidth={2.5} />
              </Pressable>

              <Column
                className="items-center justify-center"
                space={isTablet ? '2xl' : 'xl'}
              >
                <View
                  className={cn(
                    'items-center justify-center rounded-full',
                    getIconBg(),
                    isTablet ? 'h-24 w-24' : 'h-20 w-20',
                  )}
                >
                  {getIcon()}
                </View>

                <Column className="w-full items-center gap-3">
                  <Text
                    className="text-center font-headline font-black tracking-tighter text-neutral-700"
                    variant={isTablet ? 'hero' : 'title'}
                  >
                    {title}
                  </Text>

                  {description ? (
                    <Text
                      className={cn(
                        'text-center text-neutral-500 leading-relaxed',
                        isTablet ? 'text-xl' : 'text-base',
                      )}
                      variant="body"
                    >
                      {description}
                    </Text>
                  ) : undefined}
                </Column>

                <Column
                  className={cn('w-full gap-4', isTablet ? 'mt-12' : 'mt-8')}
                >
                  {primaryButtonText ? (
                    <Button
                      className="w-full"
                      onPress={onPrimaryButtonPress ?? onClose}
                      variant={type === 'error' ? 'primary' : 'gradient'}
                    >
                      {primaryButtonText}
                    </Button>
                  ) : undefined}

                  {secondaryButtonText ? (
                    <Button
                      className="w-full"
                      onPress={onSecondaryButtonPress ?? onClose}
                      variant="ghost"
                    >
                      {secondaryButtonText}
                    </Button>
                  ) : undefined}
                </Column>
              </Column>
            </Column>
          </ModalContent>
        </>
      )}
    </GSModal>
  );
}

export {
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@gluestack-ui/themed';
