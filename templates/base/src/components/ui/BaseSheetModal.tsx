import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Box } from './layout';

type BaseSheetModalProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly isVisible: boolean;
  readonly onClose: () => void;
};

/**
 * Bottom sheet rendered in the same React tree as its parent (not RN `<Modal>`).
 * RN Modal portals to a separate native window, which can lose NavigationContainer
 * context when a concurrent i18n re-render runs while the sheet is open/closing.
 */
export function BaseSheetModal({
  children,
  className = '',
  isVisible,
  onClose,
}: BaseSheetModalProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Pressable
        accessibilityRole="button"
        className="bg-black/50"
        onPress={onClose}
        style={StyleSheet.absoluteFill}
      />
      <View className="flex-1 justify-end" pointerEvents="box-none">
        <Box
          className={`rounded-t-[40px] bg-white px-6 pb-12 pt-6 ${className}`}
        >
          <View className="mb-6 h-1.5 w-12 self-center rounded-full bg-neutral-200" />
          {children}
        </Box>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
  },
});
