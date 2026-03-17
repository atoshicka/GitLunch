import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { Images } from '../../shared/constants/images';
import { TAB_BAR_CIRCLE_OVERFLOW, TAB_BAR_HEIGHT } from '../../shared/TabBar/TabBar';
import { styles } from './orders-styles';
import { selectOrders } from './selectors';
import { Order } from './slice';

type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

const SubtractIcon = Images.home.wave;

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  const orders = useSelector(selectOrders);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const MinQRCode = Images.account.minQRCode;

  const handleQrPress = (orderId: string) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <LinearGradient
      colors={['#F4F4F4', '#A8F0B5', '#86EFAC']}
      locations={[0, 0.9, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.orderCard}
    >
      <View style={styles.dateWrapper}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.dayOfWeekText}>{item.dayOfWeek}</Text>
        </View>
        <TouchableOpacity onPress={() => handleQrPress(item.id)} style={styles.qrCircle}>
          <MinQRCode width={24} height={24} />
        </TouchableOpacity>
      </View>

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

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Итого: {item.totalPrice} ₽</Text>
      </View>
    </LinearGradient>
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

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>У вас пока нет заказов</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
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
        transparent={true}
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

            <Text style={styles.modalCodeText}>код 12345</Text>
            <Text style={styles.modalQrText}>или этот QR</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};
