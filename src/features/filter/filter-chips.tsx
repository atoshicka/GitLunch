import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { LayoutChangeEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FilterChipsProps } from '../../app/navigation/navigation-types';
import { styles } from './filter-chips-styles';

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  selectedFilters,
  onSelectFilter,
  style,
  disableSort = false,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemOffsets = useRef<Record<string, number>>({});

  useEffect(() => {
    const activeFilter = selectedFilters[0];
    if (activeFilter && itemOffsets.current[activeFilter] !== undefined) {
      scrollRef.current?.scrollTo({
        x: Math.max(0, itemOffsets.current[activeFilter] - 16),
        animated: true,
      });
    }
  }, [selectedFilters]);

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
    return filters;
  }, [filters, disableSort]);

  if (!filters.length) {
    return null;
  }

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={styles.content}
    >
      {displayedFilters.map((filter) => {
        const isSelected = selectedFilters.includes(filter);
        return (
          <View
            key={filter}
            onLayout={(event: LayoutChangeEvent) => {
              itemOffsets.current[filter] = event.nativeEvent.layout.x;
            }}
          >
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
