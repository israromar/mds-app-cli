import { Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';

export const isIOS = Platform.OS === 'ios';

export function selectPlatform<T>(spec: {
  android?: T;
  default: T;
  ios?: T;
}): T {
  if (Platform.OS === 'ios' && spec.ios !== undefined) {
    return spec.ios;
  }
  if (Platform.OS === 'android' && spec.android !== undefined) {
    return spec.android;
  }
  return spec.default;
}
