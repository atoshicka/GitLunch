import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
} from '../../features/cart/store/cart-selectors';
import { addToCart, decreaseQuantity, removeFromCart } from '../../features/cart/store/cart-slice';
import { SearchInput } from '../../shared/search/ui/search-input';
import { styles } from './basket-styles';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageSvg?: FC<SvgProps>;
  imageUrl?: string;
}

type BasketScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export const BasketScreen: React.FC = () => {
  const navigation = useNavigation<BasketScreenNavigationProp>();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems) as CartItem[];
  const totalPrice = useSelector(selectCartTotalPrice);
  const totalItems = useSelector(selectCartTotalItems);

  const renderItemImage = (item: CartItem) => {
    if (item.imageSvg) {
      const SvgImage = item.imageSvg;
      return <SvgImage width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />;
    }
    return <Text style={styles.imagePlaceholder}>🍽️</Text>;
  };

  const handleSearchPress = () => {
    navigation.navigate('Search', {});
  };

  const handleAddToCart = (item: CartItem) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        imageSvg: item.imageSvg,
      })
    );
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.imageContainer}>{renderItemImage(item)}</View>

      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
            <Text style={styles.removeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.itemPrice}>{item.price * item.quantity} ₽</Text>

        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => dispatch(decreaseQuantity(item.id))}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}>{item.quantity}</Text>

          <TouchableOpacity style={styles.quantityButton} onPress={() => handleAddToCart(item)}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchInput onPress={handleSearchPress} placeholder="Поиск блюд..." />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Корзина пуста</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput onPress={handleSearchPress} placeholder="Поиск блюд..." />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Корзина</Text>
        <Text style={styles.headerCount}>{totalItems} шт.</Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Итого:</Text>
          <Text style={styles.totalPrice}>{totalPrice} ₽</Text>
        </View>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Оформить заказ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
