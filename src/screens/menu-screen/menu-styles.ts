import { StyleSheet } from 'react-native';
import { Typography } from '../../shared/fontsFile/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  waveSection: {
    position: 'relative',
    height: 220,
    backgroundColor: 'transparent',
    marginBottom: -40,
    zIndex: 1,
  },
  waveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  cafeTitle: {
    ...Typography.decorativeMedium,
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 28,
    fontWeight: '800',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 40,
  },
  menuTitle: {
    ...Typography.titleSmall,
    color: '#1F2937',
    fontWeight: '800',
    fontSize: 22,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filtersWrapper: {
    marginBottom: 8,
    minHeight: 44,
    backgroundColor: '#F4F4F4',
  },
  dishesGrid: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  sectionHeader: {
    paddingHorizontal: 4,
    paddingTop: 16,
    paddingBottom: 10,
  },
  sectionWeekday: {
    ...Typography.titleSmall,
    color: '#1F2937',
    fontWeight: '700',
  },
  sectionDate: {
    ...Typography.bodySmall,
    color: '#94A3B8',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  cardWrapper: {
    flex: 1,
  },
  emptyText: {
    ...Typography.bodyRegular,
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 32,
  },
});
