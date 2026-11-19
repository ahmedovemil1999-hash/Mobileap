import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import type { Product } from '../screens/HomeScreen';

const STORAGE_KEY = '@lesson5_products_v6';

export default function ProductDetailsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ product?: string }>();

  const product = useMemo<Product | null>(() => {
    if (!params.product) return null;
    try {
      return JSON.parse(params.product) as Product;
    } catch {
      return null;
    }
  }, [params.product]);

  const handleSaveProduct = useCallback(async (updatedProduct: Product) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current: Product[] = raw ? JSON.parse(raw) : [];
      const updated = current.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Məhsul yenilənərkən xəta:', error);
    }
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Məhsul məlumatı tapılmadı.</Text>
      </View>
    );
  }

  return (
    <ProductDetailsScreen
      product={product}
      onSaveProduct={handleSaveProduct}
      onGoBack={handleGoBack}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  errorText: { fontSize: 15, color: '#666' },
});