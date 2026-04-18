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
    minHeight: 180,
  },
  topContent: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
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
    marginBottom: 0,
    minHeight: 34,
    lineHeight: 17,
  },
  price: {
    ...Typography.buttonRegular,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: -12,
    marginBottom: 0,
  },
  actionBlock: {
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 8,
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
    width: 36,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
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
