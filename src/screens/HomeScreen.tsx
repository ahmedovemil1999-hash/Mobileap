import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  type ImageSourcePropType,
} from 'react-native';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  image?: ImageSourcePropType;
}

interface HomeScreenProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddPress: () => void;
}

function resolveImageSource(product: Product): ImageSourcePropType | undefined {
  if (product.image) {
    return product.image;
  }
  if (product.imageUrl && product.imageUrl.trim().length > 0) {
    return { uri: product.imageUrl };
  }
  return undefined;
}

export default function HomeScreen({
  products,
  onSelectProduct,
  onAddPress,
}: HomeScreenProps) {
  const renderItem = ({ item }: { item: Product }) => {
    const imageSource: ImageSourcePropType | undefined = resolveImageSource(item);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onSelectProduct(item)}
      >
        {imageSource ? (
          <Image source={imageSource} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholder]}>
            <Text style={styles.placeholderText}>Şəkil yoxdur</Text>
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.price}>{item.price} AZN</Text>
          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Text style={styles.addButtonText}>+ Yeni Məhsul Əlavə Et</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Hələ heç bir məhsul əlavə edilməyib.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
  addButton: {
    backgroundColor: Platform.select({
      ios: '#007AFF',
      android: '#1976D2',
      default: '#1976D2',
    }),
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  listContent: { paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  thumbnail: { width: 72, height: 72, borderRadius: 8 },
  placeholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { fontSize: 11, color: '#555' },
  cardInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#222' },
  price: { fontSize: 14, fontWeight: '600', color: '#2e7d32', marginTop: 2 },
  desc: { fontSize: 13, color: '#666', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#777', fontSize: 15 },
});