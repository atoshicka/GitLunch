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
import { SearchInput } from '../../../shared/ui/search-input';
import { styles } from './search-screen.styles';

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Пицца', 'Бургер', 'Суши']);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleSubmit = () => {
    if (searchQuery.trim()) {
      setRecentSearches((prev) =>
        [searchQuery, ...prev.filter((s) => s !== searchQuery)].slice(0, 5)
      );
    }
  };

  const renderRecentItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => {
        setSearchQuery(item);
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
              value={searchQuery}
              onChangeText={handleSearch}
              onSubmitEditing={handleSubmit}
              placeholder="Поиск блюд..."
            />
          </View>
        </View>

        {searchQuery.length === 0 && (
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
