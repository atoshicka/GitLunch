import { Dimensions, StyleSheet } from 'react-native';
import { Typography } from '../../shared/fontsFile/fonts';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

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
  },
  sectionTitle: {
    ...Typography.titleSmall,
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  filtersWrapper: {
    marginBottom: 16,
    minHeight: 44,
    backgroundColor: '#F4F4F4',
  },
  dishesGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dishCard: {
    width: cardWidth,
    marginRight: 8,
    marginBottom: 16,
    backgroundColor: '#DFFCEA',
    borderRadius: 30,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    ...Typography.titleMedium,
    fontSize: 40,
  },
  dishName: {
    ...Typography.bodyRegular,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  dishPrice: {
    ...Typography.buttonRegular,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  addToCartButton: {
    backgroundColor: '#22C55E',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '100%',
    alignItems: 'center',
  },
  addToCartButtonText: {
    ...Typography.buttonSmall,
    color: '#1F2937',
    fontWeight: '600',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  quantityButton: {
    backgroundColor: '#22C55E',
    width: 36,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    ...Typography.buttonRegular,
    fontWeight: 'bold',
    color: '#1F2937',
    fontSize: 20,
  },
  quantityText: {
    ...Typography.bodyRegular,
    color: '#1F2937',
    minWidth: 30,
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.bodyRegular,
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 32,
  },
});
