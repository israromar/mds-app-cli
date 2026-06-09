/**
 * NativeWind v4 only auto-maps `className` onto its built-in primitives
 * (View, Text, RN Image, etc.). Third-party components like `expo-image`'s
 * `Image` need an explicit `cssInterop` registration so `className` is
 * compiled into the `style` prop. Without this every `<Image className="..." />`
 * from `expo-image` renders at zero size.
 *
 * This module is imported for its side effect once at app boot.
 */
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';

cssInterop(Image, {
  className: {
    target: 'style',
    nativeStyleToProp: { tintColor: 'tintColor' },
  },
});
