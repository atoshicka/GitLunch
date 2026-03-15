import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    maxHeight: 44,
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
    minWidth: '100%',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    minWidth: 70,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  lastChip: {
    marginRight: 20,
  },
});
