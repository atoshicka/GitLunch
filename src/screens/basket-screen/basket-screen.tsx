import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { CartFeature } from '../../features/cart';
import { CartDayGroup, CartItem } from '../../features/cart/types';
import { DishModalFeature } from '../../features/dish-modal';
import { Images } from '../../shared/constants/images';
import { SCREEN_NAMES, TAB_NAMES } from '../../shared/constants/navigation/navigation';
import { OrderButton } from '../../shared/order-button/order-button';
import { SearchInput } from '../../shared/search/ui/search-input';
import { styles } from './basket-styles';

type BasketScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AccountIcon = Images.navigation.account;
const SubtractIcon = Images.home.wave;

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

export const BasketScreen: React.FC = () => {
  const navigation = useNavigation<BasketScreenNavigationProp>();
  const dispatch = useDispatch();

  const dayGroups = useSelector(CartFeature.selectors.selectDayGroups);
  const totalPrice = useSelector(CartFeature.selectors.selectTotalPrice);
  const loading = useSelector(CartFeature.selectors.selectCartLoading);
  const error = useSelector(CartFeature.selectors.selectCartError);
  const allItems = useSelector(CartFeature.selectors.selectAllItems);
  const selectedDates = useSelector(CartFeature.selectors.selectSelectedDates);

  useEffect(() => {
    dispatch(CartFeature.actions.fetchCart());
  }, [dispatch]);

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate(SCREEN_NAMES.TABS, { screen: TAB_NAMES.HOME });
  }, [navigation]);

  const handleDishPress = useCallback(
    (id: string) => {
      dispatch(DishModalFeature.actions.openDishModal(Number(id)));
    },
    [dispatch]
  );

  const handleDecrease = useCallback(
    (item: CartItem) => {
      dispatch(CartFeature.actions.decreaseQuantity({ id: item.id, cartItemId: item.cartItemId }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (item: CartItem) => {
      dispatch(CartFeature.actions.removeFromCart({ id: item.id, cartItemId: item.cartItemId }));
    },
    [dispatch]
  );

  const handleToggleDay = useCallback(
    (date: string) => {
      dispatch(CartFeature.actions.toggleDaySelected(date));
    },
    [dispatch]
  );

  const handlePlaceOrder = useCallback(() => {
    if (selectedDates.length === 0) {
      Alert.alert('Выберите дни', 'Отметьте хотя бы один день для заказа');
      return;
    }
    navigation.navigate(SCREEN_NAMES.PAYMENT);
  }, [selectedDates, navigation]);

  const handleAddToCart = useCallback(
    (item: CartItem) => {
      dispatch(
        CartFeature.actions.addToCart({
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

  const renderCartItem = useCallback(
    (item: CartItem) => (
      <TouchableOpacity
        key={item.cartItemId}
        activeOpacity={0.85}
        onPress={() => handleDishPress(item.id)}
      >
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
              <TouchableOpacity
                onPress={() => handleRemove(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
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
    [handleDishPress, handleDecrease, handleRemove, handleAddToCart]
  );

  const renderDayGroup = useCallback(
    ({ item: group }: { item: CartDayGroup }) => (
      <View style={styles.groupContainer}>
        <TouchableOpacity
          style={styles.groupHeader}
          onPress={() => handleToggleDay(group.date)}
          activeOpacity={0.7}
        >
          <View style={styles.groupHeaderLeft}>
            <Text style={styles.groupWeekday}>{group.dayName}</Text>
            <Text style={styles.groupDate}>{group.date}</Text>
          </View>
          <View style={[styles.checkbox, group.selected && styles.checkboxSelected]}>
            {group.selected && <View style={styles.checkboxTick} />}
          </View>
        </TouchableOpacity>
        {group.items.map((item) => renderCartItem(item))}
      </View>
    ),
    [handleToggleDay, renderCartItem]
  );

  return (
    <View style={styles.container}>
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
                <SearchInput
                  onPress={() => navigation.navigate(SCREEN_NAMES.SEARCH, {})}
                  placeholder="Поиск"
                />
              </View>
              <TouchableOpacity
                style={styles.topBarButton}
                onPress={() =>
                  navigation.navigate(SCREEN_NAMES.TABS, { screen: TAB_NAMES.ACCOUNT })
                }
              >
                <AccountIcon width={36} height={36} />
              </TouchableOpacity>
            </View>
            <Text style={styles.cafeTitle}>Корзина</Text>
          </View>
        </SafeAreaView>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Загрузка...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity onPress={() => dispatch(CartFeature.actions.fetchCart())}>
            <Text style={{ color: '#22C55E', marginTop: 12 }}>Повторить</Text>
          </TouchableOpacity>
        </View>
      ) : dayGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Корзина пуста</Text>
        </View>
      ) : (
        <FlatList
          data={dayGroups}
          renderItem={renderDayGroup}
          keyExtractor={(group) => group.date}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {allItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Итоговая цена:</Text>
            <Text style={styles.totalPrice}>{totalPrice.toFixed(2)} ₽</Text>
          </View>
          <OrderButton onPress={handlePlaceOrder} />
        </View>
      )}
    </View>
  );
};
