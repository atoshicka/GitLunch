import { StyleSheet } from 'react-native';
import { AgbalumoTypography } from '../../shared/fontsFile/agbalumoFonts';
import { Typography } from '../../shared/fontsFile/fonts';

export const errorStyles = StyleSheet.create({
  errorEmoji: {
    fontSize: 64,
    color: '#F26969',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorTitle: {
    ...AgbalumoTypography.agbalumoMedium,
    fontSize: 24,
    textAlign: 'center',
    color: '#1F2937',
  },
  errorSubTitle: {
    ...Typography.bodyRegular,
    textAlign: 'center',
    color: '#64748B',
    marginTop: 10,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#F26969',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  retryButtonText: {
    ...Typography.bodyRegular,
    color: '#F8FAFC',
    fontWeight: '600',
    fontSize: 16,
  },
});
