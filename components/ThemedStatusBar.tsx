import { useTheme } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function ThemedStatusBar() {
  const { colors, isDarkMode } = useTheme();

  return (
    <StatusBar
      style={isDarkMode ? "light" : "dark"}
      backgroundColor={colors.background}
    />
  );
}