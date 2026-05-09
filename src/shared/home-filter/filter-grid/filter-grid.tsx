import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Images } from '../../constants/images';
import { FilterCard } from '../filter-card/filter-card';
import { styles } from './filter-grid-styles';

const NowinIcon = Images.home.nowin;

interface FilterGridProps {
  onFilterPress: (filter: string) => void;
}

export const FilterGrid = React.memo(({ onFilterPress }: FilterGridProps) => (
  <View style={styles.filterGridContainer}>
    <View style={styles.row}>
      <FilterCard
        label="Горячее"
        icon={Images.filters.hot}
        onPress={() => onFilterPress('горячее')}
      />
      <FilterCard
        label="Салаты"
        icon={Images.filters.salads}
        onPress={() => onFilterPress('салаты')}
      />
    </View>
    <View style={styles.row}>
      <FilterCard
        label="Десерты"
        icon={Images.filters.desserts}
        onPress={() => onFilterPress('десерты')}
      />
      <FilterCard
        label="Бизнес-ланч"
        icon={Images.filters.snacks}
        onPress={() => onFilterPress('закуски')}
      />
    </View>
    <View style={styles.largeBlockContainer}>
      <TouchableOpacity
        style={styles.noveltyBlock}
        onPress={() => onFilterPress('новинки')}
        activeOpacity={0.9}
      >
        <NowinIcon
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          style={styles.noveltyImage}
        />
      </TouchableOpacity>
    </View>
  </View>
));
