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
import { Dish } from '../../entities/api/types/menu-types';
import { CartFeature } from '../../features/cart';
import { SearchFeature } from '../../features/search';
import { Images } from '../../shared/constants/images';
import { DishModal } from '../../shared/dish-modal/dish-modal';
import { SearchInput } from '../../shared/search/ui/search-input';
import { styles } from './search-screen-styles';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const query = useSelector(SearchFeature.selectors.selectQuery);
  const searchResults = useSelector(SearchFeature.selectors.selectResults);
  const isSearching = useSelector(SearchFeature.selectors.selectIsSearching);
  const recentSearches = useSelector(SearchFeature.selectors.selectRecentSearches);
  const cartItems = useSelector(CartFeature.selectors.selectCartItems);

  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      dispatch(SearchFeature.actions.setQuery(''));
      dispatch(SearchFeature.actions.clearResults());
    };
  }, [dispatch]);

  const handleQueryChange = useCallback(
    (text: string) => {
      dispatch(SearchFeature.actions.setQuery(text));
      dispatch(SearchFeature.actions.searchRequest(text));
    },
    [dispatch]
  );

  const addRecentSearch = useCallback(
    (text: string) => {
      dispatch(SearchFeature.actions.addRecentSearch(text));
    },
    [dispatch]
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
          imageUrl: item.imageUrl,
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

  const renderItemImage = (item: Dish) => {
    if (item.imageUrl) {
      return (
        <Image
          source={{ uri: item.imageUrl }}
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
      const cartItem = cartItems.find((i) => i.id === dishId);
      const quantity = cartItem?.quantity ?? 0;

      return (
        <View style={styles.resultItem}>
          <TouchableOpacity
            style={styles.resultContent}
            onPress={() => setSelectedDishId(item.id)}
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
    [cartItems, handleDecreaseQuantity, handleAddToCart]
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
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.recentItem} onPress={() => handleQueryChange(item)}>
                  <Text style={styles.recentText}>{item}</Text>
                </TouchableOpacity>
              )}
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
              onChangeText={handleQueryChange}
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
        onClose={() => setSelectedDishId(null)}
      />
    </SafeAreaView>
  );
};
