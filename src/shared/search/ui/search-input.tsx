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
  rightElement?: React.ReactElement;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onPress,
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = 'Поиск',
  editable = true,
  style,
  rightElement,
}) => {
  const SearchIcon = Images.search.icon;

  const inputContent = (
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
          autoFocus={!onPress}
          editable={onPress ? false : editable}
          pointerEvents={onPress ? 'none' : 'auto'}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.searchTouchable}>
          {inputContent}
        </TouchableOpacity>
      ) : (
        inputContent
      )}
      {rightElement && <View style={styles.rightElementContainer}>{rightElement}</View>}
    </View>
  );
};
