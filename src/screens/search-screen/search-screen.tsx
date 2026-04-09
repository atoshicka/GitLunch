import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect } from 'react';
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
import { RootStackParamList } from '../../app/navigation/navigation-types';
import { Dish } from '../../entities/api/types/menu-types';
import { DishCard } from '../../features/dish-card/dish-cart';
import { DishModalFeature } from '../../features/dish-modal';
import { SearchFeature } from '../../features/search';
import { SearchInput } from '../../shared/search/ui/search-input';
import { styles } from './search-screen-styles';

type SearchNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchNavigationProp>();
  const dispatch = useDispatch();

  const query = useSelector(SearchFeature.selectors.selectQuery);
  const searchResults = useSelector(SearchFeature.selectors.selectResults) as Dish[];
  const isSearching = useSelector(SearchFeature.selectors.selectIsSearching);
  const recentSearches = useSelector(SearchFeature.selectors.selectRecentSearches);

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

  const handleDishPress = useCallback(
    (id: string | number) => {
      dispatch(DishModalFeature.actions.openDishModal(Number(id)));
    },
    [dispatch]
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
          renderItem={({ item }: { item: Dish }) => (
            <View style={styles.cardWrapper}>
              <DishCard
                item={{
                  ...item,
                  weekday: item.weekday ?? 'Понедельник',
                }}
                onPress={() => handleDishPress(item.id)}
              />
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
              renderItem={({ item }: { item: string }) => (
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
    </SafeAreaView>
  );
};
