import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  filterGridContainer: {
    paddingHorizontal: 16,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  largeBlockContainer: {
    paddingHorizontal: 0,
    paddingBottom: 8,
    width: '100%',
  },
  noveltyBlock: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden',
    marginHorizontal: 0,
  },
  noveltyImage: {
    width: '100%',
    height: '100%',
  },
});
