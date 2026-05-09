import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from './order-button-styles';

interface OrderButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const OrderButton: React.FC<OrderButtonProps> = ({
  onPress,
  isLoading = false,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[styles.orderButton, (disabled || isLoading) && styles.orderButtonDisabled]}
    onPress={onPress}
    disabled={disabled || isLoading}
    activeOpacity={0.8}
  >
    <Text style={styles.orderButtonText}>{isLoading ? 'Оформляем...' : 'Оплатить'}</Text>
  </TouchableOpacity>
);
