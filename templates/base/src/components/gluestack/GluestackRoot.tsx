import type { ReactNode } from 'react';

import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';

export type GluestackRootProps = {
  readonly children: ReactNode;
};

export function GluestackRoot({ children }: GluestackRootProps) {
  return (
    <GluestackUIProvider colorMode="light" config={config}>
      {children}
    </GluestackUIProvider>
  );
}
