import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { styles } from './filter-chips-styles';

interface FilterChipsProps {
  filters: string[];
  selectedFilters: string[];
  onSelectFilter: (filter: string) => void;
  style?: ViewStyle;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  selectedFilters,
  onSelectFilter,
  style,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const scaleAnims = useRef<{ [key: string]: Animated.Value }>({}).current;

  filters.forEach((filter) => {
    if (!scaleAnims[filter]) {
      scaleAnims[filter] = new Animated.Value(1);
    }
  });

  useEffect(() => {
    if (selectedFilters.length > 0 && !selectedFilters.includes('Все')) {
      scrollViewRef.current?.scrollTo({
        x: 0,
        animated: false,
      });
    }
  }, [selectedFilters]);

  const sortedFilters = useMemo(() => {
    const allFilter = 'Все';
    const otherFilters = filters.filter((f) => f !== allFilter);

    if (selectedFilters.length === 0 || selectedFilters.includes(allFilter)) {
      return [allFilter, ...otherFilters];
    }

    const selected = otherFilters.filter((f) => selectedFilters.includes(f));
    const remaining = otherFilters.filter((f) => !selectedFilters.includes(f));

    return [allFilter, ...selected, ...remaining];
  }, [filters, selectedFilters]);

  const handlePress = (filter: string) => {
    Animated.sequence([
      Animated.timing(scaleAnims[filter], {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[filter], {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    onSelectFilter(filter);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={styles.content}
    >
      {sortedFilters.map((filter) => {
        const isSelected = selectedFilters.includes(filter);

        return (
          <Animated.View
            key={filter}
            style={{
              transform: [{ scale: scaleAnims[filter] || 1 }],
            }}
          >
            <TouchableOpacity
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => handlePress(filter)}
              activeOpacity={0.9}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{filter}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};
