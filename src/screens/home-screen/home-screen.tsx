import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { styles } from './home-styles';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Поисковое поле сверху */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск блюд..."
          placeholderTextColor="#999"
        />
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
