import { useNavigation } from '@react-navigation/native'; // добавь
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // добавь
import React from 'react';
import { Text, View } from 'react-native';
import { SearchInput } from '../../shared/search/ui/search-input';
import { styles } from './home-styles';

type RootStackParamList = {
  Tabs: undefined;
  Search: {
    category?: string;
    onSearch?: (query: string) => void;
  };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleSearchPress = () => {
    navigation.navigate('Search', {});
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput onPress={handleSearchPress} placeholder="Поиск блюд..." />
      </View>

      {/* Сетка из 4 мини-блоков */}
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <View style={styles.block}>
            <Text style={styles.blockText}>Горячее</Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.blockText}>Салаты</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.block}>
            <Text style={styles.blockText}>Десерты</Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.blockText}>Новинки</Text>
          </View>
        </View>
      </View>

      {/* Большой блок для закусок */}
      <View style={styles.largeBlockContainer}>
        <View style={styles.largeBlock}>
          <Text style={styles.largeBlockText}>Закуски</Text>
        </View>
      </View>

      {/* Текст Рестораны */}
      <Text style={styles.sectionTitle}>Рестораны</Text>

      {/* Большой блок с Цезарь */}
      <View style={styles.largeBlockContainer}>
        <View style={styles.largeBlock}>
          <Text style={styles.largeBlockText}>Цезарь</Text>
        </View>
      </View>
    </View>
  );
};
