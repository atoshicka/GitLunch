import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { MOCK_DISHES } from '../../../../mocks';
import { CartItem } from '../../../entities/api/types/cart-types';
import { Dish } from '../../../entities/api/types/menu-types';
import { CartFeature } from '../../../features/cart';
import { Images } from '../../../shared/constants/images';
import { useSearch } from '../../../shared/search/hooks/use-search';
import { SearchInput } from '../../../shared/search/ui/search-input';
import { styles } from './search-screen.styles';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { query, setQuery, searchResults } = useSearch(MOCK_DISHES);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Пицца', 'Бургер', 'Суши']);

  const cartItems = useSelector(CartFeature.selectors.selectCartItems) as CartItem[];

  const getItemQuantity = useCallback(
    (itemId: string): number => {
      const cartItem = cartItems.find((item: CartItem) => item.id === itemId);
      return cartItem?.quantity || 0;
    },
    [cartItems]
  );

  const handleSubmit = () => {
    if (query.trim()) {
      setRecentSearches((prev: string[]) =>
        [query, ...prev.filter((s: string) => s !== query)].slice(0, 5)
      );
    }
  };

  const handleAddToCart = useCallback(
    (item: Dish) => {
      dispatch(
        CartFeature.actions.addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          imageSvg: item.imageSvg,
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

  const renderItemImage = (item: Dish) => {
    if (item.imageSvg) {
      const SvgImage = item.imageSvg;
      return <SvgImage width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />;
    }
    return <Text style={styles.resultImagePlaceholder}>{Images.promo.placeholder}</Text>;
  };

  const renderSearchResult = ({ item }: { item: Dish }) => {
    const quantity = getItemQuantity(item.id);

    return (
      <View style={styles.resultItem}>
        <TouchableOpacity
          style={styles.resultContent}
          onPress={() => {
            console.log('Выбрано:', item.name);
          }}
        >
          <View style={styles.imageContainer}>{renderItemImage(item)}</View>
          <View style={styles.resultInfo}>
            <Text style={styles.resultName}>{item.name}</Text>
            <Text style={styles.resultPrice}>{item.price} ₽</Text>
          </View>
        </TouchableOpacity>

        {quantity > 0 ? (
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleDecreaseQuantity(item.id)}
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
  };

  const renderRecentItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => {
        setQuery(item);
        handleSubmit();
      }}
    >
      <Text style={styles.recentText}>{item}</Text>
    </TouchableOpacity>
  );

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

        <View style={styles.content}>
          {query.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.resultsList}
              ListEmptyComponent={<Text style={styles.emptyText}>Ничего не найдено</Text>}
            />
          ) : (
            <View style={styles.recentContainer}>
              <Text style={styles.recentTitle}>Недавние запросы</Text>
              <FlatList
                data={recentSearches}
                renderItem={renderRecentItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
