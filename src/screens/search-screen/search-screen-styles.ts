import { Dimensions, StyleSheet } from 'react-native';
import { Typography } from '../../shared/fontsFile/fonts';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#F4F4F4',
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backButtonText: {
    ...Typography.buttonRegular,
    fontSize: 40,
    color: '#1F2937',
    lineHeight: 40,
  },
  searchContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  hintText: {
    ...Typography.bodyRegular,
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
  },
  recentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  recentTitle: {
    ...Typography.titleSmall,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  recentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  recentText: {
    ...Typography.bodyRegular,
    fontSize: 16,
    color: '#1F2937',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWrapper: {
    width: COLUMN_WIDTH,
  },
  emptyText: {
    ...Typography.bodyRegular,
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 32,
  },
});
