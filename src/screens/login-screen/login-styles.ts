import { StyleSheet } from 'react-native';
import { AgbalumoTypography } from '../../shared/fontsFile/agbalumoFonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  vectorTopLeft: {
    position: 'absolute',
    top: -30,
    left: -30,
    opacity: 0.8,
  },
  vectorBottomRight: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    opacity: 0.8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  logoTextAgbalumo: {
    ...AgbalumoTypography.agbalumoMedium,
    color: '#1F2937',
    marginTop: 4,
    letterSpacing: 1,
  },
  form: {
    width: '100%',
    zIndex: 1,
  },
  inputGroup: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 4,
    marginLeft: 5,
  },
  generalError: {
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#1BB910',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
  },
  buttonText: {
    color: '#1F2937',
  },
});
