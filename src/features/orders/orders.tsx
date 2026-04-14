import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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

const STATUS_COLOR: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  preparing: '#8B5CF6',
  ready: '#22C55E',
  delivered: '#64748B',
  cancelled: '#EF4444',
};

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  const dispatch = useDispatch();

  const orders = useSelector(OrdersFeature.selectors.selectOrders);
  const isLoading = useSelector(OrdersFeature.selectors.selectIsLoading);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const MinQRCode = Images.account.minQRCode;

  useEffect(() => {
    dispatch(OrdersFeature.actions.fetchOrders());
  }, [dispatch]);

  const handleQrPress = useCallback((orderId: number) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  }, []);

  const handleConfirmPickup = useCallback(
    (orderId: number) => {
      dispatch(OrdersFeature.actions.confirmPickup(orderId));
    },
    [dispatch]
  );

  const handleRemoveOrder = useCallback(
    (orderId: number) => {
      dispatch(OrdersFeature.actions.removeOrder(orderId));
    },
    [dispatch]
  );

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const renderOrderItem = useCallback(
    ({ item }: { item: Order }) => {
      const statusColor = STATUS_COLOR[item.status] ?? '#94A3B8';
      const canPickup = item.status === 'ready';
      const isArchived = item.status === 'delivered' || item.status === 'cancelled';

      return (
        <LinearGradient
          colors={['#F4F4F4', '#A8F0B5', '#86EFAC']}
          locations={[0, 0.9, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.orderCard}
        >
          <View style={styles.dateWrapper}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>Заказ №{item.orderNumber}</Text>
              <Text style={styles.dayOfWeekText}>
                {new Date(item.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  weekday: 'long',
                })}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleQrPress(item.id)} style={styles.qrCircle}>
              <MinQRCode width={20} height={20} />
            </TouchableOpacity>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{item.statusLabel}</Text>
          </View>

          {item.items && item.items.length > 0 && (
            <View style={styles.itemsContainer}>
              {item.items.map((orderItem) => (
                <View key={orderItem.id} style={styles.orderItem}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {orderItem.name}
                  </Text>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemQuantity}>x{orderItem.quantity}</Text>
                    <Text style={styles.itemPrice}>{orderItem.price * orderItem.quantity} ₽</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Итого: {item.totalAmount} ₽</Text>
          </View>

          {canPickup && (
            <TouchableOpacity
              style={styles.pickupButton}
              onPress={() => handleConfirmPickup(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.pickupButtonText}>Я забрал заказ ✓</Text>
            </TouchableOpacity>
          )}

          {isArchived && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleRemoveOrder(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Удалить из списка</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      );
    },
    [MinQRCode, handleConfirmPickup, handleQrPress, handleRemoveOrder]
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

            <MinQRCode width={180} height={180} />

            <Text style={styles.modalCodeText}>заказ №{selectedOrder?.orderNumber ?? '—'}</Text>
            <Text style={styles.modalQrText}>покажи этот QR при получении</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};
