import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  waveContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  sideButtonsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  sideButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  circleIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
