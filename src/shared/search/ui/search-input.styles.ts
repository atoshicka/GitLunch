import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F4',
    borderRadius: 24,
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
    color: '#495E7C',
    fontSize: 16,
    padding: 0,
    margin: 0,
    flex: 1,
  },
  searchIcon: {
    width: 22,
    height: 22,
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
