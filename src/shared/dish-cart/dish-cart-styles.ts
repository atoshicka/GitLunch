import { Dimensions, StyleSheet } from 'react-native';
import { Typography } from '../fontsFile/fonts';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = (width - 48) / 2;

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  card: {
    borderRadius: 30,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 220,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
    ...Typography.bodyRegular,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    minHeight: 36,
  },
  price: {
    ...Typography.buttonRegular,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#22C55E',
    borderRadius: 15,
    paddingVertical: 10,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  quantityText: {
    ...Typography.bodyRegular,
    color: '#1F2937',
    minWidth: 24,
    textAlign: 'center',
  },
});
