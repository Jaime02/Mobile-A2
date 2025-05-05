import { ThemeProvider } from '@/context/ThemeContext';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const customFonts = {
  'MainFont': require('../assets/fonts/alternategothicno1.otf'),
};

export default function RootLayout() {
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
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
