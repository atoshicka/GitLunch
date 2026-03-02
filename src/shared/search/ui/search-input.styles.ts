import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  placeholderContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    color: '#94A3B8',
    fontSize: 16,
    padding: 0,
    margin: 0,
    flex: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#1F2937',
    marginRight: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    fontSize: 16,
    color: '#0F172A',
    padding: 0,
    margin: 0,
    flex: 1,
  },
});
