jest.mock('expo-updates', () =>
  require('./src/tests/__mocks__/libs/expo-updates'),
);

jest.mock('react-native-keyboard-controller', () =>
  require('./src/tests/__mocks__/libs/react-native-keyboard-controller'),
);

jest.mock('@sentry/react-native', () =>
  require('./src/tests/__mocks__/sentry'),
);

jest.mock('./src/services/sentry', () =>
  require('./src/tests/__mocks__/services-sentry'),
);

import './src/tests/__mocks__/libs';
import './src/tests/__mocks__/getAssetsContext';
