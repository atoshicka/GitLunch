import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { Weekday } from '../../entities/api/types/menu-types';
import { CartFeature } from '../../features/cart';
import { CartItem, CartItemGroup } from '../../features/cart/types';
import { DishModalFeature } from '../../features/dish-modal';
import { Images } from '../../shared/constants/images';
import { SCREEN_NAMES, TAB_NAMES } from '../../shared/constants/navigation';
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

  const weekdayGroups = useSelector(CartFeature.selectors.selectCartWeekdayGroups);
  const totalPrice = useSelector(CartFeature.selectors.selectCartTotalPrice);
  const loading = useSelector(CartFeature.selectors.selectCartLoading);
  const error = useSelector(CartFeature.selectors.selectCartError);
  const items = useSelector(CartFeature.selectors.selectCartItems);

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
          weekday: item.weekday,
        })
      );
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

  const handleToggleWeekday = useCallback(
    (weekday: Weekday) => {
      dispatch(CartFeature.actions.toggleWeekday(weekday));
    },
    [dispatch]
  );

  const handlePlaceOrder = useCallback(() => {
    if (items.length === 0) {
      Alert.alert('Корзина пуста', 'Добавьте блюда в корзину');
      return;
    }
    navigation.navigate(SCREEN_NAMES.PAYMENT);
  }, [items.length, navigation]);

  const renderCartItem = useCallback(
    (item: CartItem) => (
      <TouchableOpacity key={item.id} activeOpacity={0.85} onPress={() => handleDishPress(item.id)}>
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
    [handleAddToCart, handleDecrease, handleDishPress, handleRemove]
  );

  const renderGroup = useCallback(
    ({ item: group }: { item: CartItemGroup }) => (
      <View style={styles.groupContainer}>
        <TouchableOpacity
          style={styles.groupHeader}
          onPress={() => handleToggleWeekday(group.weekday)}
          activeOpacity={0.7}
        >
          <View style={styles.groupHeaderLeft}>
            <Text style={styles.groupWeekday}>{group.weekday}</Text>
            <Text style={styles.groupDate}>{group.date}</Text>
          </View>
          <View style={[styles.checkbox, group.selected && styles.checkboxSelected]}>
            {group.selected && <Text style={styles.checkboxTick}>✓</Text>}
          </View>
        </TouchableOpacity>

        {group.items.map((item) => renderCartItem(item))}
      </View>
    ),
    [handleToggleWeekday, renderCartItem]
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
      ) : weekdayGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Корзина пуста</Text>
        </View>
      ) : (
        <FlatList
          data={weekdayGroups}
          renderItem={renderGroup}
          keyExtractor={(group) => group.weekday}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.promoRow}>
            <Text style={styles.promoLabel}>Акции</Text>
            <Text style={styles.promoValue}>—</Text>
          </View>
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>Скидка</Text>
            <Text style={styles.discountValue}>—</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Итог</Text>
            <Text style={styles.totalPrice}>{totalPrice} ₽</Text>
          </View>
          <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
            <Text style={styles.orderButtonText}>Оплатить</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
