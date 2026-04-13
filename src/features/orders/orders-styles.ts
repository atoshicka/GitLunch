import { StyleSheet } from 'react-native';
import { AgbalumoTypography } from '../../shared/fontsFile/agbalumoFonts';
import { Typography } from '../../shared/fontsFile/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  waveSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 0,
  },
  waveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  waveContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 64,
  },
  topBarButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 40,
    color: '#1F2937',
    lineHeight: 44,
  },
  brandTitle: {
    ...AgbalumoTypography.agbalumoSmall,
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  screenTitle: {
    ...AgbalumoTypography.agbalumoMedium,
    fontSize: 28,
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 20,
    paddingBottom: 8,
  },
  flatList: {
    flex: 1,
    marginTop: 220,
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 220,
  },
  emptyText: {
    ...Typography.bodySmall,
    color: '#999999',
  },

  // Карточка заказа
  orderCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    ...Typography.buttonSmall,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  dayOfWeekText: {
    ...Typography.caption,
    color: '#666666',
  },
  qrCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Статус
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 10,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
  },

  // Блюда
  itemsContainer: {
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemName: {
    ...Typography.caption,
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemQuantity: {
    ...Typography.caption,
    color: '#666666',
  },
  itemPrice: {
    ...Typography.caption,
    fontWeight: '500',
    color: '#1F2937',
    minWidth: 60,
    textAlign: 'right',
  },
  totalContainer: {
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  totalText: {
    ...Typography.buttonSmall,
    fontWeight: '700',
    color: '#1F2937',
  },

  // Кнопки действий
  cancelButton: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.caption,
    color: '#EF4444',
    fontWeight: '600',
  },
  pickupButton: {
    marginTop: 10,
    backgroundColor: '#22C55E',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pickupButtonText: {
    ...Typography.caption,
    color: '#1F2937',
    fontWeight: '700',
  },

  // Модалка
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    paddingTop: 32,
    alignItems: 'center',
    position: 'relative',
    minWidth: 260,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalCloseText: {
    ...Typography.buttonSmall,
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  modalCodeText: {
    ...Typography.buttonSmall,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  modalQrText: {
    ...Typography.caption,
    color: '#666666',
  },
});
