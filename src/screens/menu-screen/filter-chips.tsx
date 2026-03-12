import React, { useCallback, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FilterChipsProps } from '../../app/navigation/navigation-types';
import { styles } from './filter-chips-styles';

const ALL_FILTER = 'Все';

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  selectedFilters,
  onSelectFilter,
  style,
  disableSort = false,
}) => {
  const handlePress = useCallback(
    (filter: string) => {
      onSelectFilter(filter);
    },
    [onSelectFilter]
  );

  const displayedFilters = useMemo(() => {
    if (disableSort || !filters.length) {
      return filters;
    }

    const hasAllFilter = filters.includes(ALL_FILTER);

    if (!hasAllFilter) {
      return filters;
    }

    const otherFilters = filters.filter((f) => f !== ALL_FILTER);

    if (selectedFilters.length === 0 || selectedFilters.includes(ALL_FILTER)) {
      return [ALL_FILTER, ...otherFilters];
    }

    const selected = otherFilters.filter((f) => selectedFilters.includes(f));
    const remaining = otherFilters.filter((f) => !selectedFilters.includes(f));

    return [ALL_FILTER, ...selected, ...remaining];
  }, [filters, selectedFilters, disableSort]);

  if (!filters.length) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={styles.content}
    >
      {displayedFilters.map((filter) => {
        const isSelected = selectedFilters.includes(filter);
        return (
          <View key={filter}>
            <TouchableOpacity
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
                filter === displayedFilters[displayedFilters.length - 1] && styles.lastChip,
              ]}
              onPress={() => handlePress(filter)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
                numberOfLines={1}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};
