import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const mockItems = [
  {
    id: '1',
    title: 'iPhone 14 Pro',
    price: '$900',
    location: 'Seattle, WA',
    description: 'Like new iPhone 14 Pro, 128GB, great condition.',
    image: 'https://source.unsplash.com/400x400/?iphone,tech',
    seller: {
      id: 'a1',
      name: 'Alice',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    category: 'Electronics',
  },
  {
    id: '2',
    title: 'Mountain Bike',
    price: '$250',
    location: 'Portland, OR',
    description: '26-inch mountain bike with Shimano gears.',
    image: 'https://source.unsplash.com/400x400/?bike',
    seller: {
      id: 'b2',
      name: 'Bob',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    category: 'Vehicles',
  },
  {
    id: '3',
    title: 'Gaming Laptop',
    price: '$1200',
    location: 'San Jose, CA',
    description: 'Powerful gaming laptop with RTX graphics.',
    image: 'https://source.unsplash.com/400x400/?laptop,gaming',
    seller: {
      id: 'c3',
      name: 'Charlie',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    category: 'Electronics',
  },
];

const SellerProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;

  const [sellerInfo, setSellerInfo] = useState(null);
  const [sellerItems, setSellerItems] = useState([]);

  useEffect(() => {
    const filtered = mockItems.filter(item => item.seller.id === userId);
    if (filtered.length > 0) {
      setSellerInfo(filtered[0].seller);
      setSellerItems(filtered);
    }
  }, [userId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('BazarItemDetail', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </TouchableOpacity>
  );

  if (!sellerInfo) return null;

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sellerInfo.name}'s Listings</Text>
      </View>

      {/* Seller Info */}
      <View style={styles.profile}>
        <Image source={{ uri: sellerInfo.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{sellerInfo.name}</Text>
      </View>

      {/* Seller's Items */}
      <FlatList
        data={sellerItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default SellerProfileScreen;

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backIcon: {
    fontSize: 24,
    marginRight: 10,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profile: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 10,
  },
  item: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fefefe',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  price: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },
});