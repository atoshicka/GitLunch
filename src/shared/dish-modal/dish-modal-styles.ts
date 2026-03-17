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
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
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
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    ...Typography.buttonSmall,
    color: '#64748B',
    fontWeight: '600',
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
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  metaBadgeGreen: {
    backgroundColor: '#DFFCEA',
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
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  price: {
    ...Typography.decorativeMedium,
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
  },
  addButtonText: {
    ...Typography.buttonRegular,
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
    height: 40,
    borderRadius: 20,
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
});
