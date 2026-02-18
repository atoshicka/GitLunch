import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#F8FAFC',
    color: '#495E7C',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#1BB910',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
