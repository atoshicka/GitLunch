import { StyleSheet } from 'react-native';
import { Typography } from '../../shared/fontsFile/fonts';

export const styles = StyleSheet.create({
  orderButton: {
    backgroundColor: '#1F2937',
    width: '90%',
    paddingVertical: 18,
    borderRadius: 40,
    alignItems: 'center',
  },
  orderButtonDisabled: {
    opacity: 0.5,
  },
  orderButtonText: {
    ...Typography.buttonRegular,
    fontWeight: '600',
    fontSize: 18,
    color: '#F4F4F4',
  },
});
