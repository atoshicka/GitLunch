import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { styles } from './filter-card-styles';

interface FilterCardProps {
  label: string;
  icon: React.FC<SvgProps>;
  onPress: () => void;
}

export const FilterCard: React.FC<FilterCardProps> = ({ label, icon: Icon, onPress }) => (
  <TouchableOpacity style={styles.filterBlock} onPress={onPress} activeOpacity={0.7}>
    <Icon width={80} height={80} style={styles.filterIcon} />
    <Text style={styles.filterText}>{label}</Text>
  </TouchableOpacity>
);
