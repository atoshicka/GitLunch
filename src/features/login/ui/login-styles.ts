import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937', // тёмный фон 🖤
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
    borderColor: '#4B5563', // чуть светлее граница
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#374151', // тёмный инпут
    color: '#F9FAFB', // светлый текст
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#f87171', // мягкий красный
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#86EFAC', // оставим зелёную, красиво контрастирует
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonText: {
    color: '#1F2937', // тёмный текст на зелёном
    fontSize: 16,
    fontWeight: 'bold',
  },
});
