import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60, // увеличил отступ сверху
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 32,
    color: '#0F172A',
    lineHeight: 32,
  },
  searchContainer: {
    flex: 1,
  },
  recentContainer: {
    padding: 16,
    paddingTop: 20,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  recentItem: {
    paddingVertical: 12,
  },
  recentText: {
    fontSize: 16,
    color: '#0F172A',
  },
});
