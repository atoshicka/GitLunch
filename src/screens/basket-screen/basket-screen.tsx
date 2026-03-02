import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
} from '../../features/cart/store/cart-selectors';
import { addToCart, decreaseQuantity, removeFromCart } from '../../features/cart/store/cart-slice';
import { styles } from './basket-styles';

export const BasketScreen: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const totalItems = useSelector(selectCartTotalItems);

  const renderItem = ({ item }: { item: (typeof items)[0] }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          {item.price} ₽ x {item.quantity}
        </Text>
      </View>

      <View style={styles.itemControls}>
        <TouchableOpacity onPress={() => dispatch(decreaseQuantity(item.id))}>
          <Text style={styles.controlButton}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantity}>{item.quantity}</Text>

        <TouchableOpacity
          onPress={() =>
            dispatch(
              addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
              })
            )
          }
        >
          <Text style={styles.controlButton}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
          <Text style={styles.removeButton}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Корзина пуста</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Корзина</Text>
        <Text style={styles.headerCount}>{totalItems} шт.</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Итого: {totalPrice} ₽</Text>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Оформить заказ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
