import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import { Modal, Pressable, StatusBar, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/layout';

type ImageViewerModalProps = {
  readonly accessibilityCloseLabel?: string;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly uri: string | undefined;
};

/**
 * Fullscreen, distraction-free image viewer. Black backdrop, the image fit to
 * screen, and a single close (X) control. Tapping the backdrop also closes.
 */
export function ImageViewerModal({
  accessibilityCloseLabel = 'Close',
  isOpen,
  onClose,
  uri,
}: ImageViewerModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={isOpen}
    >
      <StatusBar animated barStyle="light-content" />
      <Pressable
        accessibilityRole="button"
        onPress={onClose}
        style={styles.backdrop}
      >
        {uri ? (
          <Image
            cachePolicy="memory-disk"
            contentFit="contain"
            source={uri}
            style={styles.image}
            transition={150}
          />
        ) : null}
      </Pressable>

      <Box className="absolute right-4" style={{ top: insets.top + 12 }}>
        <Pressable
          accessibilityLabel={accessibilityCloseLabel}
          accessibilityRole="button"
          className="bg-white/15 h-11 w-11 rounded-full items-center justify-center active:bg-white/25"
          hitSlop={12}
          onPress={onClose}
        >
          <X color="#FFFFFF" size={22} strokeWidth={2.4} />
        </Pressable>
      </Box>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.96)',
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
