import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import type { Product } from './HomeScreen';

interface AddProductScreenProps {
  onAddProduct: (product: Product) => void;
  onGoBack: () => void;
}

export default function AddProductScreen({
  onAddProduct,
  onGoBack,
}: AddProductScreenProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('İcazə tələb olunur', 'Şəkil seçmək üçün qalereya icazəsi verin.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveImageToDeviceStorage = async (sourceUri: string | null): Promise<string> => {
    if (!sourceUri) return '';

    const baseDir = FileSystem.documentDirectory;
    if (!baseDir) return sourceUri;

    const imagesDir = `${baseDir}products/`;
    const dirInfo = await FileSystem.getInfoAsync(imagesDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
    }

    const fileName = `product_${Date.now()}.jpg`;
    const destUri = `${imagesDir}${fileName}`;

    await FileSystem.copyAsync({
      from: sourceUri,
      to: destUri,
    });

    return destUri;
  };

  const handleAdd = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Xəta', 'Zəhmət olmasa məhsulun adını və qiymətini daxil edin.');
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      Alert.alert('Xəta', 'Qiymət düzgün rəqəm olmalıdır.');
      return;
    }

    try {
      const localImageUrl = await saveImageToDeviceStorage(imageUri);

      const newProduct: Product = {
        id: String(Date.now()),
        name: name.trim(),
        price: numericPrice,
        description: description.trim(),
        imageUrl: localImageUrl,
      };

      onAddProduct(newProduct);
      onGoBack();
    } catch (error) {
      console.error('Şəkil saxlanılarkən xəta:', error);
      Alert.alert('Xəta', 'Məhsul və ya şəkil yadda saxlanıla bilmədi.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Ad (name)</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Məsələn: iPhone 16"
        />

        <Text style={styles.label}>Qiymət (price)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="Məsələn: 2400"
        />

        <Text style={styles.label}>Təsvir (description)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Qısa təsvir yazın..."
        />

        <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
          <Text style={styles.imagePickerText}>
            {imageUri ? 'Şəkli Dəyiş' : 'Cihazdan Şəkil Seç'}
          </Text>
        </TouchableOpacity>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : null}

        <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
          <Text style={styles.submitBtnText}>Əlavə Et</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
    backgroundColor: '#fafafa',
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  imagePickerBtn: {
    borderWidth: 1,
    borderColor: Platform.select({
      ios: '#007AFF',
      android: '#1976D2',
      default: '#1976D2',
    }),
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerText: {
    color: Platform.select({
      ios: '#007AFF',
      android: '#1976D2',
      default: '#1976D2',
    }),
    fontWeight: '600',
  },
  preview: { width: '100%', height: 180, borderRadius: 10, marginBottom: 16 },
  submitBtn: {
    backgroundColor: Platform.select({
      ios: '#007AFF',
      android: '#1976D2',
      default: '#1976D2',
    }),
    padding: 15,
    borderRadius: Platform.select({ ios: 12, android: 6, default: 8 }),
    alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});