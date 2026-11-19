import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Məhsullar' }} />
        <Stack.Screen name="add-product" options={{ title: 'Yeni Məhsul' }} />
        <Stack.Screen name="product-details" options={{ title: 'Məhsul Detalları' }} />
      </Stack>
    </ThemeProvider>
  );
}