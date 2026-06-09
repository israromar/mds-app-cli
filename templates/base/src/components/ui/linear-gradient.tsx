import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from 'react-native-svg';

export type LinearGradientProps = {
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly colors: readonly string[];
  readonly end?: [number, number];
  readonly start?: [number, number];
  readonly style?: ViewStyle;
};

const DEFAULT_START: [number, number] = [0, 0];
const DEFAULT_END: [number, number] = [0, 1];

export function LinearGradient({
  children = undefined,
  colors,
  start = DEFAULT_START,
  end = DEFAULT_END,
  className = undefined,
  style = undefined,
  ...props
}: LinearGradientProps) {
  return (
    <View className={className} style={[styles.container, style]} {...props}>
      <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
        <Defs>
          <SvgLinearGradient
            id="grad"
            x1={`${start[0] * 100}%`}
            x2={`${end[0] * 100}%`}
            y1={`${start[1] * 100}%`}
            y2={`${end[1] * 100}%`}
          >
            {colors.map((color, index) => (
              <Stop
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                offset={`${(index / (colors.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </SvgLinearGradient>
        </Defs>
        <Rect fill="url(#grad)" height="100%" width="100%" />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
