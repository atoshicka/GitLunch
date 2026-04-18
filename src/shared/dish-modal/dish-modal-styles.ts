import { Dimensions, StyleSheet } from 'react-native';
import { Typography } from '../fontsFile/fonts';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.85,
    backgroundColor: '#F4F4F4',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  handle: {
    width: 80,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#C8C8C8',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C8C8C8',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    ...Typography.buttonSmall,
    color: '#F4F4F4',
    fontWeight: '800',
  },
  centered: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...Typography.bodyRegular,
    color: '#EF4444',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    ...Typography.buttonSmall,
    color: '#1F2937',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 8,
  },
  image: {
    width: '100%',
    height: 260,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#DFFCEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 64,
  },
  infoBlock: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  name: {
    ...Typography.titleMedium,
    color: '#1F2937',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metaBadge: {
    backgroundColor: '#D8D8D8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  metaBadgeGreen: {
    backgroundColor: '#DFFCEA',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  metaBadgeText: {
    ...Typography.label,
    color: '#1F2937',
    fontWeight: '500',
  },
  description: {
    ...Typography.bodyRegular,
    color: '#475569',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.buttonRegular,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  ingredients: {
    ...Typography.bodySmall,
    color: '#64748B',
  },
  nutritionBlock: {
    backgroundColor: '#DFFCEA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#22C55E',
  },
  nutritionLabel: {
    ...Typography.bodySmall,
    color: '#475569',
    fontWeight: '500',
  },
  nutritionValue: {
    ...Typography.bodySmall,
    color: '#1F2937',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#D0D0D0',
    backgroundColor: '#F4F4F4',
  },
  price: {
    ...Typography.decorativeMedium,
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  addButtonText: {
    ...Typography.buttonLarge,
    color: '#1F2937',
    fontWeight: '600',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    backgroundColor: '#22C55E',
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    ...Typography.titleMedium,
    color: '#1F2937',
  },
  quantityText: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 32,
    textAlign: 'center',
  },
  dragArea: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 4,
  },
});
