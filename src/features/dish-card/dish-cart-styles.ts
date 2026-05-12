import { Dimensions, StyleSheet } from 'react-native';
import { Typography } from '../../shared/fontsFile/fonts';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = (width - 48) / 2;

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  card: {
    borderRadius: 30,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 240,
    flexDirection: 'column',
  },
  topContent: {
    width: '100%',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imagePlaceholder: {
    fontSize: 40,
  },
  name: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    height: 34,
    lineHeight: 17,
    flexShrink: 0,
  },
  price: {
    ...Typography.buttonSmall,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
    marginBottom: 0,
  },
  actionBlock: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
    flexShrink: 0,
  },
  addToCartButton: {
    backgroundColor: '#22C55E',
    borderRadius: 15,
    paddingVertical: 8,
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  addToCartButtonText: {
    ...Typography.buttonSmall,
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 12,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  quantityButton: {
    backgroundColor: '#22C55E',
    width: 32,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  quantityText: {
    ...Typography.bodySmall,
    color: '#1F2937',
    minWidth: 20,
    textAlign: 'center',
    fontSize: 12,
  },
});
