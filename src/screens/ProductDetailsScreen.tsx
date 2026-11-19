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
import type { Product } from './HomeScreen';

interface ProductDetailsScreenProps {
  product: Product;
  onSaveProduct: (updatedProduct: Product) => void;
  onGoBack: () => void;
}

export default function ProductDetailsScreen({
  product,
  onSaveProduct,
  onGoBack,
}: ProductDetailsScreenProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [description, setDescription] = useState(product.description || '');

  const handleSave = () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Xəta', 'Ad və qiymət boş ola bilməz.');
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
      Alert.alert('Xəta', 'Qiymət düzgün rəqəm olmalıdır.');
      return;
    }

    const updatedProduct: Product = {
      ...product,
      name: name.trim(),
      price: numericPrice,
      description: description.trim(),
    };

    onSaveProduct(updatedProduct);
    onGoBack();
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
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        ) : null}

        <Text style={styles.label}>Ad (name)</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Məhsulun adı"
        />

        <Text style={styles.label}>Qiymət (price)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="0.00"
        />

        <Text style={styles.label}>Təsvir (description)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Məhsul haqqında məlumat"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, paddingBottom: 40 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 16 },
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
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: Platform.select({
      ios: '#34C759',
      android: '#2E7D32',
      default: '#2E7D32',
    }),
    padding: 15,
    borderRadius: Platform.select({ ios: 12, android: 6, default: 8 }),
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});