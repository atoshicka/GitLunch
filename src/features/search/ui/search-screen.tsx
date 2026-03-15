import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
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
import { CartItem } from '../../../entities/api/types/cart-types';
import { Dish } from '../../../entities/api/types/menu-types';
import { CartFeature } from '../../../features/cart';
import { MenuFeature } from '../../../features/menu';
import { Images } from '../../../shared/constants/images';
import { DishModal } from '../../../shared/dish-modal/dish-modal';
import { useSearch } from '../../../shared/search/hooks/use-search';
import { SearchInput } from '../../../shared/search/ui/search-input';
import { styles } from './search-screen.styles';

const BASE_URL = 'https://gitlunch-backend-production.up.railway.app';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const dishes = useSelector(MenuFeature.selectors.selectDishes);
  const isLoading = useSelector(MenuFeature.selectors.selectMenuIsLoading);

  const { query, setQuery, searchResults } = useSearch(dishes);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);

  const cartItems = useSelector(CartFeature.selectors.selectCartItems) as CartItem[];

  // Загружаем блюда если ещё не загружены
  useEffect(() => {
    if (dishes.length === 0 && !isLoading) {
      dispatch({ type: 'menu/fetchDishes' });
    }
  }, [dishes.length, isLoading, dispatch]);

  const getItemQuantity = useCallback(
    (itemId: string): number => {
      const cartItem = cartItems.find((item: CartItem) => item.id === itemId);
      return cartItem?.quantity ?? 0;
    },
    [cartItems]
  );

  const handleSubmit = useCallback(() => {
    if (query.trim()) {
      setRecentSearches((prev) => [query, ...prev.filter((s) => s !== query)].slice(0, 5));
    }
  }, [query]);

  const handleAddToCart = useCallback(
    (item: Dish) => {
      dispatch(
        CartFeature.actions.addToCart({
          id: String(item.id),
          name: item.name,
          price: parseFloat(item.price),
          imageSvg: item.imageSvg,
          imageUrl: item.image_url ? `${BASE_URL}${item.image_url}` : undefined,
        })
      );
    },
    [dispatch]
  );

  const handleDecreaseQuantity = useCallback(
    (itemId: string) => {
      dispatch(CartFeature.actions.decreaseQuantity(itemId));
    },
    [dispatch]
  );

  const handleDishPress = useCallback((id: number) => {
    setSelectedDishId(id);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedDishId(null);
  }, []);

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
      const quantity = getItemQuantity(String(item.id));

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
                onPress={() => handleDecreaseQuantity(String(item.id))}
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
    [getItemQuantity, handleDishPress, handleDecreaseQuantity, handleAddToCart]
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
    if (isLoading && dishes.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={styles.loadingText}>Загрузка блюд...</Text>
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
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <SearchInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              placeholder="Поиск блюд..."
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
