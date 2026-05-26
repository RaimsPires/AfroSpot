module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@contexts': './src/contexts',
          '@i18n': './src/i18n',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@theme': './src/theme',
          '@assets': './src/assets',
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@store': './src/store',
          '@utils': './src/utils',
          '@permissions': './src/permissions',
          '@type': './src/types',
        },
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.js',
          '.jsx',
          '.json',
        ],
      },
    ],
    'react-native-worklets/plugin',
  ],
};
