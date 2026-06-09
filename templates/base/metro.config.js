const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
defaultConfig.resolver.assetExts = assetExts.filter(
  (extension) => extension !== 'svg',
);
defaultConfig.resolver.sourceExts = [...sourceExts, 'svg'];
defaultConfig.resolver.extraNodeModules = {
  ...defaultConfig.resolver.extraNodeModules,
  '@opentelemetry/api': require.resolve('./scripts/empty-module.js'),
};
defaultConfig.transformer = {
  ...defaultConfig.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
  unstable_allowRequireContext: true,
};

module.exports = withNativeWind(defaultConfig, {
  input: './global.css',
});
