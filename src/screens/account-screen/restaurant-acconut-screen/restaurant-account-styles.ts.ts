import { StyleSheet } from 'react-native';
import { AgbalumoTypography } from '../../../shared/fontsFile/agbalumoFonts';
import { Typography } from '../../../shared/fontsFile/fonts';

export const styles = StyleSheet.create({
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
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    alignItems: 'center',
    paddingTop: 120,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DFFCEA',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  userName: {
    ...AgbalumoTypography.agbalumoMedium,
    color: '#1F2937',
    fontSize: 28,
    marginBottom: 8,
  },
  userDescription: {
    ...Typography.bodyRegular,
    color: '#6B7280',
    fontSize: 16,
    marginBottom: 32,
  },
  menuBlock: {
    width: '100%',
    backgroundColor: '#86EFAC',
    borderRadius: 20,
    paddingVertical: 8,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#A7F3D0',
  },
  menuItemText: {
    ...Typography.buttonRegular,
    fontWeight: '500',
    color: '#1F2937',
  },
});
