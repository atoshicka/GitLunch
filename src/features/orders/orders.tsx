import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { Images } from '../../shared/constants/images';
import { styles } from './orders-styles';
import { selectOrders } from './selectors';
import { Order } from './slice';

type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Мои заказы</Text>
        <View style={{ width: 40 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>У вас пока нет заказов</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
    </SafeAreaView>
  );
};
