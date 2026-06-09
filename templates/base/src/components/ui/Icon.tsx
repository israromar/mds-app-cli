import type { LucideIcon } from 'lucide-react-native';

export type IconProps = {
  /** The Lucide icon component to render */
  readonly as: LucideIcon;
  /** Color of the icon */
  readonly color?: string;
  /** Size of the icon */
  readonly size?: number;
  /** Stroke width of the icon */
  readonly strokeWidth?: number;
};

/**
 * A standard Icon component using Lucide React Native.
 * This integrates perfectly with gluestack-ui's design philosophy.
 */
export function Icon({
  as: IconComponent,
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
}: IconProps) {
  return <IconComponent color={color} size={size} strokeWidth={strokeWidth} />;
}
