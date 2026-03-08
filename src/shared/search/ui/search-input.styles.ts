import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchContainer: {
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  placeholderContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  placeholderText: {
    color: '#1F2937',
    fontSize: 14,
    flex: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
    marginLeft: 4,
  },
});
