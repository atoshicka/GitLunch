import { StyleSheet } from 'react-native';
import { Typography } from '../../fontsFile/fonts';

export const styles = StyleSheet.create({
  filterBlock: {
    backgroundColor: '#F4F4F4',
    borderRadius: 32,
    width: '48%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1BB910',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterIcon: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  filterText: {
    ...Typography.buttonRegular,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
});
