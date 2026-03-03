import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MOCK_DISHES } from '../../../../mocks';
import { Images } from '../../../shared/constants/images';
import { useSearch } from '../../../shared/search/hooks/use-search';
import { SearchInput } from '../../../shared/search/ui/search-input';
import { styles } from './search-screen.styles';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const { query, setQuery, searchResults } = useSearch(MOCK_DISHES);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Пицца', 'Бургер', 'Суши']);

  const handleSubmit = () => {
    if (query.trim()) {
      setRecentSearches((prev: string[]) =>
        [query, ...prev.filter((s: string) => s !== query)].slice(0, 5)
      );
    }
  };

  const renderSearchResult = ({ item }: { item: (typeof MOCK_DISHES)[0] }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        console.log('Выбрано:', item.name);
      }}
    >
      <View style={styles.resultImageContainer}>
        <Text style={styles.resultImagePlaceholder}>{Images.promo.placeholder}</Text>
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultPrice}>{item.price} ₽</Text>
      </View>
    </TouchableOpacity>
  );

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
