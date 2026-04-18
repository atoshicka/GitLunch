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
    gap: 8,
  },
  topBarButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  backButtonText: {
    fontSize: 40,
    color: '#1F2937',
    lineHeight: 44,
  },
  searchInputWrapper: {
    flex: 1,
  },
  cafeTitle: {
    ...AgbalumoTypography.agbalumoSmall,
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 25,
    fontSize: 28,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.bodyRegular,
    color: '#94A3B8',
  },
  list: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },

  groupContainer: {
    marginBottom: 24,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  groupHeaderLeft: {
    flex: 1,
  },
  groupWeekday: {
    ...Typography.titleSmall,
    color: '#1F2937',
    fontWeight: '700',
  },
  groupDate: {
    ...Typography.bodySmall,
    color: '#94A3B8',
    marginTop: 2,
  },

  // Чекбокс
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },

  // Карточка товара
  cartItem: {
    flexDirection: 'row',
    borderRadius: 30,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  imagePlaceholder: {
    fontSize: 40,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    ...Typography.bodyRegular,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  removeButton: {
    fontSize: 20,
    color: '#EF4444',
    paddingLeft: 10,
  },
  itemPrice: {
    ...Typography.buttonRegular,
    fontWeight: '700',
    color: '#1F2937',
    marginVertical: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    width: 36,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  quantityText: {
    ...Typography.bodyRegular,
    minWidth: 30,
    textAlign: 'center',
    backgroundColor: '#DFFCEA',
    borderWidth: 1,
    borderColor: '#1BB910',
    borderRadius: 6,
    paddingHorizontal: 8,
  },

  // Футер
  footer: {
    padding: 20,
    paddingBottom: 20,
    backgroundColor: '#22C55E',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  promoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  promoLabel: {
    ...Typography.buttonRegular,
    color: '#1F2937',
  },
  promoValue: {
    ...Typography.bodyRegular,
    color: '#1F2937',
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  discountLabel: {
    ...Typography.buttonRegular,
    color: '#1F2937',
  },
  discountValue: {
    ...Typography.bodyRegular,
    color: '#1F2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    ...Typography.buttonRegular,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalPrice: {
    ...Typography.titleSmall,
    fontWeight: '800',
    color: '#1F2937',
  },
  orderButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  orderButtonText: {
    ...Typography.buttonRegular,
    fontWeight: '600',
    color: '#DFFCEA',
  },
});
