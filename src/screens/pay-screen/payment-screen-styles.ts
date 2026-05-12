import { StyleSheet } from 'react-native';
import { AgbalumoTypography } from '../../shared/fontsFile/agbalumoFonts';
import { Typography } from '../../shared/fontsFile/fonts';

export const paymentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  waveSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 0,
  },
  waveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  waveContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 64,
  },
  topBarButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 40,
    color: '#1F2937',
    lineHeight: 44,
  },
  brandTitle: {
    ...AgbalumoTypography.agbalumoSmall,
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  keyboardAvoidingView: {
    flex: 1,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 210,
    paddingBottom: 44,
    paddingHorizontal: 20,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    ...Typography.bodyRegular,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 25,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  disabledInputText: {
    ...Typography.bodyRegular,
    color: '#495E7C',
  },
  sbpContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingLeft: 4,
  },
  cardBlock: {
    width: '100%',
    borderRadius: 35,
    padding: 24,
    marginTop: 10,
    marginBottom: 24,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardBlockTitle: {
    ...Typography.titleSmall,
    marginBottom: 16,
    color: '#1F2937',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  row: {
    flexDirection: 'row',
  },
});
