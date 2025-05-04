import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import AppColors from '@/constants/AppColors';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const customFonts = {
  'MainFont': require('../assets/fonts/alternategothicno1.otf'),
};

function TabLayoutContent() {
  const { colors } = useTheme();
  const [fontsLoaded, fontError] = useFonts(customFonts);

  // Hide the splash screen once the fonts are loaded or if there's an error
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: AppColors.Red,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
      },
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.text,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons size={28} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <ThemeProvider>
      <TabLayoutContent />
    </ThemeProvider>
  );
}
