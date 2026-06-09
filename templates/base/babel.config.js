/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
        },
        extensions: ['.js', '.json'],
        root: ['./src'],
      },
    ],
    '@babel/plugin-transform-export-namespace-from',
    '@babel/plugin-transform-class-static-block',
    // Hermes (local hermesc) can't parse dynamic `import()` with inline comments
    // emitted by `@supabase/supabase-js` OTEL tracing. Transform to require().
    'dynamic-import-node',
    'react-native-worklets/plugin', // need to be the last plugin
  ],
  presets: ['babel-preset-expo', 'nativewind/babel'],
};
