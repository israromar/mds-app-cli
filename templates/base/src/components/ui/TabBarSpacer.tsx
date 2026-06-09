import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GET_TAB_BAR_VERTICAL_SPACE } from '@/constants/navigation';

/**
 * A dedicated spacer component for use at the bottom of scrollable areas.
 * Ensures content is pushed above the floating tab bar while maintaining
 * full-screen background transparency.
 */
export function TabBarSpacer() {
  const insets = useSafeAreaInsets();
  const height = GET_TAB_BAR_VERTICAL_SPACE(insets.bottom);

  return <View style={{ height }} />;
}
