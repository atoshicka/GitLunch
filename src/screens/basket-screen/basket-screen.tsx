import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import {
  selectCartError,
  selectCartItems,
  selectCartLoading,
  selectCartTotalItems,
  selectCartTotalPrice,
} from '../../features/cart/cart-selectors';
import {
  addToCart,
  clearCart,
  decreaseQuantity,
  removeFromCart,
} from '../../features/cart/cart-slice';
import { CartItem } from '../../features/cart/types';
import { addOrder } from '../../features/orders/slice';
import { Images } from '../../shared/constants/images';
import { DishModal } from '../../shared/dish-modal/dish-modal';
import { SearchInput } from '../../shared/search/ui/search-input';
import { styles } from './basket-styles';

type BasketScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

const AccountIcon = Images.navigation.account;
const SubtractIcon = Images.home.wave;

const getCurrentDateInfo = () => {
  const now = new Date();
  const daysOfWeek = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];
  const date = now.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const dayOfWeek = daysOfWeek[now.getDay()];
  return { date, dayOfWeek };
};

export const BasketScreen: React.FC = () => {
  const navigation = useNavigation<BasketScreenNavigationProp>();
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const totalItems = useSelector(selectCartTotalItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);

  useEffect(() => {
    dispatch({ type: 'FETCH_CART' });
  }, [dispatch]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search', {});
  }, [navigation]);

  const handleAccountPress = useCallback(() => {
    navigation.navigate('Tabs', { screen: 'Аккаунт' });
  }, [navigation]);

  const handleDishPress = useCallback((id: string) => {
    setSelectedDishId(Number(id));
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedDishId(null);
  }, []);

  const handleAddToCart = useCallback(
    (item: CartItem) => {
      dispatch(
        addToCart({
          id: item.id,
          cartItemId: item.cartItemId,
          name: item.name,
          price: item.price,
          imageSvg: item.imageSvg,
          imageUrl: item.imageUrl,
        })
      );
    },
    [dispatch]
  );

  const handleDecrease = useCallback(
    (item: CartItem) => {
      dispatch(decreaseQuantity({ id: item.id, cartItemId: item.cartItemId }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (item: CartItem) => {
      dispatch(removeFromCart({ id: item.id, cartItemId: item.cartItemId }));
    },
    [dispatch]
  );

  const handlePlaceOrder = useCallback(() => {
    if (items.length === 0) {
      Alert.alert('Корзина пуста', 'Добавьте блюда в корзину');
      return;
    }
    const { date, dayOfWeek } = getCurrentDateInfo();
    const newOrder = {
      id: Date.now().toString(),
      date,
      dayOfWeek,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice,
      totalItems,
    };
    dispatch(addOrder(newOrder));
    dispatch(clearCart());
    Alert.alert('Успешно', 'Заказ оформлен!');
  }, [dispatch, items, totalPrice, totalItems]);

  const renderItemImage = (item: CartItem) => {
    if (item.imageUrl) {
      return (
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: '100%', height: '100%', borderRadius: 12 }}
          resizeMode="contain"
        />
      );
    }
    if (item.imageSvg) {
      const SvgImage = item.imageSvg;
      return <SvgImage width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />;
    }
    return <Text style={styles.imagePlaceholder}>🍽</Text>;
  };

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <TouchableOpacity activeOpacity={0.85} onPress={() => handleDishPress(item.id)}>
        <LinearGradient
          colors={['#F4F4F4', '#A8F0B5', '#86EFAC']}
          locations={[0, 0.8, 1.3]}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.cartItem}
        >
          <View style={styles.imageContainer}>{renderItemImage(item)}</View>
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              <TouchableOpacity onPress={() => handleRemove(item)}>
                <Text style={styles.removeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.itemPrice}>{item.price * item.quantity} ₽</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.quantityButton} onPress={() => handleDecrease(item)}>
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={() => handleAddToCart(item)}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    ),
    [handleAddToCart, handleDecrease, handleDishPress, handleRemove]
  );

  const waveHeader = (
    <View style={styles.waveSection}>
      <View style={styles.waveBackground}>
        <SubtractIcon width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </View>
      <SafeAreaView edges={['top']} style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.topBarButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <View style={styles.searchInputWrapper}>
              <SearchInput onPress={handleSearchPress} placeholder="Поиск" />
            </View>
            <TouchableOpacity style={styles.topBarButton} onPress={handleAccountPress}>
              <AccountIcon width={36} height={36} />
            </TouchableOpacity>
          </View>
          <Text style={styles.cafeTitle}>Корзина</Text>
        </View>
      </SafeAreaView>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {waveHeader}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Загрузка...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {waveHeader}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity onPress={() => dispatch({ type: 'FETCH_CART' })}>
            <Text style={{ color: '#86EFAC', marginTop: 12 }}>Повторить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        {waveHeader}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Корзина пуста</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {waveHeader}

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
        <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
          <Text style={styles.orderButtonText}>Оформить заказ</Text>
        </TouchableOpacity>
      </View>

      <DishModal
        dishId={selectedDishId}
        visible={selectedDishId !== null}
        onClose={handleModalClose}
      />
    </View>
  );
};
