module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@reduxjs/toolkit|redux-saga|immer|@react-native-firebase|@notifee|@react-native-async-storage)/)',
  ],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
  },
  setupFiles: ['<rootDir>/__mocks__/setup.js'],
};
