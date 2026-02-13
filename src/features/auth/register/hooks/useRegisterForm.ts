import { useState } from 'react';
import { Keyboard } from 'react-native';
import { RegisterFormData, RegisterFormErrors } from '../model/types';
import { validateRegisterForm } from '../model/validation';

const initialFormData: RegisterFormData = {
  login: '',
  password: '',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
};

export const useRegisterForm = (onRegisterSuccess: () => void) => {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = validateRegisterForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    Keyboard.dismiss();

    if (validateForm()) {
      onRegisterSuccess();
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleRegister,
    resetForm,
  };
};
