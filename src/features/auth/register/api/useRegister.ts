import { RegisterFormData } from '../model/types';
export const useRegister = () => {
  const register = async (data: RegisterFormData) => {
    console.log('Register data:', data);
    return { success: true };
  };

  return { register };
};
