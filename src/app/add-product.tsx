import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddProductScreen from '../screens/AddProductScreen';
import type { Product } from '../screens/HomeScreen';

const STORAGE_KEY = '@lesson5_products_v6';

export default function AddProductRoute() {
  const router = useRouter();

  const handleAddProduct = useCallback(async (newProduct: Product) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: Product[] = raw ? JSON.parse(raw) : [];
      const updated = [newProduct, ...current];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Yeni məhsul saxlanılarkən xəta:', error);
    }
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <AddProductScreen
      onAddProduct={handleAddProduct}
      onGoBack={handleGoBack}
    />
  );
}