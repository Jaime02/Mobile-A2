import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export const useTextStyles = () => {
  const { colors } = useTheme();
  
  return StyleSheet.create({
    default: {
      color: colors.text,
    },
    heading: {
      fontSize: 24,
      color: colors.text,
    },
    subheading: {
      fontSize: 18,
      color: colors.text,
    },
    body: {
      fontSize: 16,
      color: colors.text,
    },
    small: {
      fontSize: 14,
      color: colors.text,
    },
    secondary: {
      color: colors.textSecondary,
    }
  });
}; 