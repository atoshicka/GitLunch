import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { DishCard } from '../../features/dish-card/dish-cart';
import { SearchFeature } from '../../features/search';
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

  const handleSubmit = useCallback(() => {
    if (query.trim()) {
      dispatch(SearchFeature.actions.addRecentSearch(query));
    }
  }, [query, dispatch]);

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
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <DishCard item={item} onPress={() => setSelectedDishId(Number(item.id))} />
            </View>
          )}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={<Text style={styles.emptyText}>Ничего не найдено</Text>}
          showsVerticalScrollIndicator={false}
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
