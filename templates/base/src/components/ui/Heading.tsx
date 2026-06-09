import { Heading as GSHeading } from '@gluestack-ui/themed';
import React from 'react';

import { cn } from '@/utils/cn';

type HeadingProps = React.ComponentProps<typeof GSHeading>;

export function Heading({ className, ...props }: HeadingProps) {
  return (
    <GSHeading
      className={cn('font-interBold text-foreground', className)}
      {...props}
    />
  );
}
