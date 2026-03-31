import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Dish } from '../../entities/api/types/menu-types';
import { CartFeature } from '../../features/cart';
import { CartItem } from '../../features/cart/types';
import { Images } from '../../shared/constants/images';
import { DishModal } from '../../shared/dish-modal/dish-modal';
import { useSearch } from '../../shared/search/hooks/use-search';
import { SearchInput } from '../../shared/search/ui/search-input';
import { styles } from './search-screen-styles';

const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const cartItems = useSelector(CartFeature.selectors.selectCartItems);
  const { query, setQuery, searchResults, isSearching, recentSearches, addRecentSearch } =
    useSearch();

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);

  const getCartItem = useCallback(
    (itemId: string): CartItem | undefined => cartItems.find((item) => item.id === itemId),
    [cartItems]
  );

  const handleSubmit = useCallback(() => {
    if (query.trim()) {
      addRecentSearch(query);
    }
  }, [query, addRecentSearch]);

  const handleAddToCart = useCallback(
    (item: Dish) => {
      const dishId = String(item.id);
      const cartItem = cartItems.find((i) => i.id === dishId);
      dispatch(
        CartFeature.actions.addToCart({
          id: dishId,
          cartItemId: cartItem?.cartItemId,
          name: item.name,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          imageSvg: item.imageSvg,
          imageUrl: item.image_url ? `${BASE_URL}${item.image_url}` : undefined,
        })
      );
    },
    [dispatch, cartItems]
  );

  const handleDecreaseQuantity = useCallback(
    (itemId: string) => {
      const cartItem = cartItems.find((i) => i.id === itemId);
      dispatch(
        CartFeature.actions.decreaseQuantity({
          id: itemId,
          cartItemId: cartItem?.cartItemId,
        })
      );
    },
    [dispatch, cartItems]
  );

  const handleDishPress = useCallback((id: number) => setSelectedDishId(id), []);
  const handleModalClose = useCallback(() => setSelectedDishId(null), []);

  const renderItemImage = (item: Dish) => {
    if (item.image_url) {
      return (
        <Image
          source={{ uri: `${BASE_URL}${item.image_url}` }}
          style={{ width: '100%', height: '100%', borderRadius: 8 }}
          resizeMode="contain"
        />
      );
    }
    if (item.imageSvg) {
      const SvgImage = item.imageSvg;
      return <SvgImage width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />;
    }
    return <Text style={styles.resultImagePlaceholder}>{Images.promo.placeholder}</Text>;
  };

  const renderSearchResult = useCallback(
    ({ item }: { item: Dish }) => {
      const dishId = String(item.id);
      const cartItem = getCartItem(dishId);
      const quantity = cartItem?.quantity ?? 0;

      return (
        <View style={styles.resultItem}>
          <TouchableOpacity
            style={styles.resultContent}
            onPress={() => handleDishPress(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.imageContainer}>{renderItemImage(item)}</View>
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultPrice}>{item.price} ₽</Text>
              {item.category?.name ? (
                <Text style={styles.resultCategory}>{item.category.name}</Text>
              ) : null}
            </View>
          </TouchableOpacity>

          {quantity > 0 ? (
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleDecreaseQuantity(dishId)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={() => handleAddToCart(item)}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
              <Text style={styles.addButtonText}>В корзину</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    },
    [getCartItem, handleDishPress, handleDecreaseQuantity, handleAddToCart]
  );

  const renderRecentItem = useCallback(
    ({ item }: { item: string }) => (
      <TouchableOpacity style={styles.recentItem} onPress={() => setQuery(item)}>
        <Text style={styles.recentText}>{item}</Text>
      </TouchableOpacity>
    ),
    [setQuery]
  );

  const renderContent = () => {
    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      );
    }

    if (query.length > 0) {
      return (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={<Text style={styles.emptyText}>Ничего не найдено</Text>}
        />
      );
    }

    return (
      <View style={styles.recentContainer}>
        {recentSearches.length > 0 ? (
          <>
            <Text style={styles.recentTitle}>Недавние запросы</Text>
            <FlatList
              data={recentSearches}
              renderItem={renderRecentItem}
              keyExtractor={(_, index) => index.toString()}
            />
          </>
        ) : (
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>Введите название блюда, категорию или состав</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <SearchInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              placeholder="Поиск"
            />
          </View>
        </View>

        <View style={styles.content}>{renderContent()}</View>
      </KeyboardAvoidingView>

      <DishModal
        dishId={selectedDishId}
        visible={selectedDishId !== null}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
};
