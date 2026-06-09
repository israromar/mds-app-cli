import { Dimensions } from 'react-native';

import { isAndroid } from '@/utils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Constants for the Floating Navigation Dock.
 * Values are chosen to match the high-fidelity design standards.
 */
export const TAB_BAR_HEIGHT = 72;
export const TAB_BAR_BASE_OFFSET = isAndroid ? 12 : 0;

/**
 * Total height of the protected area at the bottom of the screen.
 * Used for padding content to avoid overlap with the floating bar.
 */
export const GET_TAB_BAR_VERTICAL_SPACE = (bottomInset: number) => {
  const bottomOffset = Math.max(bottomInset, 16) + TAB_BAR_BASE_OFFSET;
  return TAB_BAR_HEIGHT + bottomOffset + 12; // Extra 12px for breathing room
};

export const IS_LARGE_SCREEN = SCREEN_HEIGHT > 800;
