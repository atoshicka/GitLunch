import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { Typography } from '../fontsFile/fonts';
import { styles } from './form-input-styles';

interface FormInputProps extends TextInputProps {
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ error, style, ...props }) => {
  return (
    <View style={styles.inputGroup}>
      <TextInput
        style={[styles.input, Typography.bodyRegular, error && styles.inputError, style]}
        placeholderTextColor="#495E7C"
        {...props}
      />
      {error && <Text style={[styles.errorText, Typography.caption]}>{error}</Text>}
    </View>
  );
};
