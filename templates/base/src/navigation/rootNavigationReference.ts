import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from '@/navigation/types';

export const rootNavigationReference =
  createNavigationContainerRef<RootStackParamList>();
