import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { OrdersFeature } from '../../features/orders';
import { Order, OrderStatus } from '../../features/orders/types';
import { DAY_NAMES } from '../../shared/constants/constants';
import { Images } from '../../shared/constants/images';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../shared/TabBar/TabBar';
import { styles } from './orders-styles';

type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

const SubtractIcon = Images.home.wave;

const isWeekend = (dayIndex: number): boolean => dayIndex === 0 || dayIndex === 6;

const formatDeliveryInfo = (deliveryInfo: string | undefined, status: OrderStatus): string => {
  if (!deliveryInfo) return '';

  if (status === 'ready') return 'Готов к выдаче';
  if (status === 'delivered') return 'Доставлен';

  const parts = deliveryInfo.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);

    if (!isNaN(date.getTime())) {
      const dayIndex = date.getDay();
      if (isWeekend(dayIndex)) return '';

      const dayName = DAY_NAMES[dayIndex];
      const prefix = dayName === 'вторник' ? 'во' : 'в';
      return `Доставим ${prefix} ${dayName}, ${deliveryInfo}`;
    }
  }
  return deliveryInfo;
};

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  const dispatch = useDispatch();

  const orders = useSelector(OrdersFeature.selectors.selectOrders);
  const isLoading = useSelector(OrdersFeature.selectors.selectIsLoading);
  const error = useSelector(OrdersFeature.selectors.selectError);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const prevPickupCodeRef = useRef<string | undefined>(undefined);

  const MinQRCode = Images.account.minQRCode;

  useEffect(() => {
    dispatch(OrdersFeature.actions.fetchOrders());
  }, [dispatch]);

  const prevError = useRef<string | null>(null);
  useEffect(() => {
    if (error && error !== prevError.current) {
      Alert.alert('Ошибка', error);
      setIsLoadingDetails(false);
    }
    prevError.current = error ?? null;
  }, [error]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  useEffect(() => {
    if (!isLoadingDetails) return;
    const pickupCode = selectedOrder?.pickupCode;
    if (pickupCode && pickupCode !== prevPickupCodeRef.current) {
      prevPickupCodeRef.current = pickupCode;
      setIsLoadingDetails(false);
    }
  }, [selectedOrder?.pickupCode, isLoadingDetails]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setIsLoadingDetails(false);
    prevPickupCodeRef.current = undefined;
  }, []);

  const handleQrPress = useCallback(
    (orderId: number) => {
      prevPickupCodeRef.current = undefined;
      setIsLoadingDetails(true);
      dispatch(OrdersFeature.actions.fetchOrderDetails(orderId));
      setSelectedOrderId(orderId);
      setModalVisible(true);
    },
    [dispatch]
  );

  const handleDestroyAll = useCallback(() => {
    Alert.alert('Удалить все заказы', 'Это действие нельзя отменить. Продолжить?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: () => dispatch(OrdersFeature.actions.destroyAllOrders()),
      },
    ]);
  }, [dispatch]);

  const renderOrderItem = useCallback(
    ({ item }: { item: Order }) => {
      const parts = item.deliveryInfo?.split('.') || [];
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        if (isWeekend(date.getDay())) return null;
      }

      return (
        <LinearGradient
          colors={['#F4F4F4', '#A8F0B5', '#86EFAC']}
          locations={[0, 0.9, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.orderCard}
        >
          <View style={styles.dateWrapper}>
            <Text style={styles.deliveryDateText}>
              {formatDeliveryInfo(item.deliveryInfo, item.status)}
            </Text>
            {item.status !== 'delivered' && (
              <TouchableOpacity onPress={() => handleQrPress(item.id)} style={styles.qrCircle}>
                <MinQRCode width={20} height={20} />
              </TouchableOpacity>
            )}
          </View>
          {item.items && item.items.length > 0 ? (
            <View style={styles.itemsContainer}>
              {item.items.map((orderItem) => (
                <View key={orderItem.id} style={styles.orderItem}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {orderItem.name}
                  </Text>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemQuantity}>×{orderItem.quantity}</Text>
                    <Text style={styles.itemPrice}>{orderItem.price * orderItem.quantity} ₽</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.itemsContainer}>
              <Text style={[styles.itemName, { color: '#94A3B8', fontStyle: 'italic' }]}>
                Состав заказа загружается…
              </Text>
            </View>
          )}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Итого: {item.totalAmount} ₽</Text>
          </View>
        </LinearGradient>
      );
    },
    [MinQRCode, handleQrPress]
  );

  return (
    <View style={styles.container}>
      <View style={styles.waveSection} pointerEvents="none">
        <View style={styles.waveBackground}>
          <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        </View>
      </View>

      <SafeAreaView edges={['top']} style={styles.waveContent}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.topBarButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.brandTitle}>GitLunch</Text>

          <TouchableOpacity style={styles.topBarButton} onPress={handleDestroyAll}>
            <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: 'bold' }}>DEL ALL</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.screenTitle}>Мои заказы</Text>
      </SafeAreaView>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>У вас пока нет заказов</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_CIRCLE_OVERFLOW },
          ]}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
        />
      )}

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            {isLoadingDetails ? (
              <ActivityIndicator size="large" color="#22C55E" />
            ) : selectedOrder?.pickupCode ? (
              <>
                <QRCode value={selectedOrder.pickupCode} size={180} />
                <Text style={styles.modalCodeText}>
                  Код для получения: {selectedOrder.pickupCode}
                </Text>
                <Text style={styles.modalQrText}>или этот QR-код</Text>
              </>
            ) : (
              <Text style={styles.modalCodeText}>Код для получения недоступен</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
