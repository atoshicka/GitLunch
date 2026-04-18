import { StyleSheet } from 'react-native';
import { AgbalumoTypography } from '../../shared/fontsFile/agbalumoFonts';
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
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  backButtonText: {
    fontSize: 40,
    color: '#1F2937',
    lineHeight: 44,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  searchWrapperInner: {
    flex: 1,
    marginRight: 8,
  },
  accountButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cafeTitle: {
    ...AgbalumoTypography.agbalumoSmall,
    color: '#1F2937',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
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
