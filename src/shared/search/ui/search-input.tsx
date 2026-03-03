import React from 'react';
import { TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Images } from '../../../shared/constants/images';
import { styles } from './search-input.styles';

interface SearchInputProps {
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  editable?: boolean;
  style?: ViewStyle;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onPress,
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = 'Поиск блюд...',
  editable = true,
  style,
}) => {
  const SearchIcon = Images.search.icon;

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.searchContainer, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.placeholderContainer}>
          <SearchIcon width={24} height={24} style={styles.searchIcon} />
          <TextInput
            style={styles.placeholderText}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            editable={false}
            pointerEvents="none"
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, styles.searchContainer, style]}>
      <View style={styles.inputWrapper}>
        <SearchIcon width={24} height={24} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="search"
          autoFocus
          editable={editable}
        />
      </View>
    </View>
  );
};
