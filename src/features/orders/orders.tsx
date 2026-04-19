// screens/OrdersScreen.tsx
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
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
import { Order } from '../../features/orders/types';
import { Images } from '../../shared/constants/images';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../shared/TabBar/TabBar';
import { styles } from './orders-styles';

type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

const SubtractIcon = Images.home.wave;

const DAYS = ['Понедельник', 'Вторник', 'Среду', 'Четверг', 'Пятницу'];

const formatDeliveryDate = (deliveryDate: string): string => {
  const date = new Date(deliveryDate);
  const dayName = DAYS[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  if (dayName === 'Вторник') {
    return `Доставим во ${dayName}, ${day}.${month}`;
  } else {
    return `Доставим в ${dayName}, ${day}.${month}`;
  }
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

  const MinQRCode = Images.account.minQRCode;

  useEffect(() => {
    dispatch(OrdersFeature.actions.fetchOrders());
  }, [dispatch]);

  const prevError = React.useRef<string | null>(null);
  useEffect(() => {
    if (error && error !== prevError.current) {
      Alert.alert('Ошибка', error);
    }
    prevError.current = error ?? null;
  }, [error]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  useEffect(() => {
    if (selectedOrder?.pickupCode) {
      setIsLoadingDetails(false);
    }
  }, [selectedOrder?.pickupCode]);

  const handleQrPress = useCallback(
    (orderId: number) => {
      setIsLoadingDetails(true);
      dispatch(OrdersFeature.actions.fetchOrderDetails(orderId));
      setSelectedOrderId(orderId);
      setModalVisible(true);
    },
    [dispatch]
  );

  const handleConfirmPickup = useCallback(
    (orderId: number) => {
      dispatch(OrdersFeature.actions.confirmPickup(orderId));
    },
    [dispatch]
  );

  const renderOrderItem = useCallback(
    ({ item }: { item: Order }) => {
      const isReady = item.status === 'ready';

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
              {item.deliveryDate ? formatDeliveryDate(item.deliveryDate) : ''}
            </Text>
            <TouchableOpacity onPress={() => handleQrPress(item.id)} style={styles.qrCircle}>
              <MinQRCode width={20} height={20} />
            </TouchableOpacity>
          </View>

          {item.status !== 'pending' && (
            <View
              style={[styles.statusBadge, { backgroundColor: isReady ? '#22C55E20' : '#94A3B820' }]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: isReady ? '#22C55E' : '#94A3B8' }]}
              />
              <Text style={[styles.statusText, { color: isReady ? '#22C55E' : '#64748B' }]}>
                {item.statusLabel}
              </Text>
            </View>
          )}

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

          {isReady && (
            <TouchableOpacity
              style={styles.pickupButton}
              onPress={() => handleConfirmPickup(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.pickupButtonText}>Я забрал заказ ✓</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      );
    },
    [MinQRCode, handleConfirmPickup, handleQrPress]
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
          <View style={styles.topBarButton} />
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
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            {isLoadingDetails ? (
              <ActivityIndicator size="large" color="#22C55E" />
            ) : (
              <>
                {selectedOrder?.pickupCode ? (
                  <>
                    <QRCode value={selectedOrder.pickupCode} size={180} />
                    <Text style={styles.modalCodeText}>
                      Код для получения: {selectedOrder.pickupCode}
                    </Text>
                    <Text style={styles.modalQrText}>или этот QR-код</Text>
                  </>
                ) : (
                  <Text style={styles.modalCodeText}>
                    Код для получения: {selectedOrder?.pickupCode ?? '—'}
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
