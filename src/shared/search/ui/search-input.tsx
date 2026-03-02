import React from 'react';
import {
  Image,
  ImageSourcePropType,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { styles } from './search-input.styles';

const searchIcon = require('../../../assets/images/search.png');

interface SearchInputProps {
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  editable?: boolean;
  style?: ViewStyle;
  iconSource?: ImageSourcePropType;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onPress,
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = 'Поиск блюд...',
  editable = true,
  style,
  iconSource = searchIcon,
}) => {
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.searchContainer, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.placeholderContainer}>
          <Image source={iconSource} style={styles.searchIcon} resizeMode="contain" />
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
        <Image source={iconSource} style={styles.searchIcon} resizeMode="contain" />
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
