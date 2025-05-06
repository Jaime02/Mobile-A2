import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import AppColors from '@/constants/AppColors';

export const useTextStyles = () => {
  const { colors } = useTheme();
  
  return StyleSheet.create({
    default: {
      color: colors.text,
    },
    heading: {
      fontSize: 32,
      color: colors.text,
    },
    subheading: {
      fontSize: 24,
      color: colors.text,
    },
    body: {
      fontSize: 20,
      color: colors.text,
    },
    bodyEmphasized: {
      fontSize: 22,
      color: AppColors.Red,
    },
    secondary: {
      color: colors.textSecondary,
      fontSize: 16
    }
  });
}; 