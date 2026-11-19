import React, { useState, useCallback } from 'react';
import { type ImageSourcePropType } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen, { type Product } from '../screens/HomeScreen';

const STORAGE_KEY = '@lesson5_products_v6';

const PRODUCT_IMAGES: Record<'iphone' | 'airpods' | 'keyboard', ImageSourcePropType> = {
  iphone: require('../../assets/productimage/iPhone-15-Blue.png'),
  airpods: require('../../assets/productimage/airpods pro.jpg'),
  keyboard: require('../../assets/productimage/keyboard.png'), // klavye faylının adını özündəki ilə eyni et
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 16',
    price: 2400,
    description: '128GB, yüksək performanslı kamera və uzunömürlü batareya.',
    imageUrl: '',
    image: PRODUCT_IMAGES.iphone,
  },
  {
    id: '2',
    name: 'AirPods Pro',
    price: 520,
    description: 'Aktiv səsboğucu və simsiz şarj qutusu ilə qulaqlıq.',
    imageUrl: '',
    image: PRODUCT_IMAGES.airpods,
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    price: 185,
    description: 'Kodlaşdırma və gündəlik istifadə üçün rahat mexaniki klaviatura.',
    imageUrl: '',
    image: PRODUCT_IMAGES.keyboard,
  },
];

export default function IndexScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw !== null) {
        setProducts(JSON.parse(raw));
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
        setProducts(INITIAL_PRODUCTS);
      }
    } catch (error) {
      console.error('Məhsullar yüklənərkən xəta:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  const handleSelectProduct = useCallback(
    (product: Product) => {
      router.push({
        pathname: '/product-details',
        params: { product: JSON.stringify(product) },
      });
    },
    [router]
  );

  const handleAddPress = useCallback(() => {
    router.push('/add-product');
  }, [router]);

  return (
    <HomeScreen
      products={products}
      onSelectProduct={handleSelectProduct}
      onAddPress={handleAddPress}
    />
  );
}