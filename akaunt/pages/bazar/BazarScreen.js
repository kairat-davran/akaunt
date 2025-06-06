import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

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

const categories = ['All', 'Electronics', 'Vehicles'];

const BazarScreen = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    setItems(mockItems);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('BazarItemDetail', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.location}>{item.location}</Text>

      <TouchableOpacity
        style={styles.sellerInfo}
        onPress={() => navigation.navigate('SellerProfile', { userId: item.seller.id })}
      >
        <Image source={{ uri: item.seller.avatar }} style={styles.avatar} />
        <Text style={styles.sellerName}>{item.seller.name}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.topBarContainer}>
        <View style={styles.topBar}>
          <TextInput
            placeholder="Search marketplace..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('PostNewItem')}
            style={styles.postButton}
          >
            <Text style={styles.postButtonText}>+ Post</Text>
          </TouchableOpacity>
          <View style={styles.profileDropdownWrapper}>
            <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
              <Image
                source={{ uri: auth.user.avatar || 'https://randomuser.me/api/portraits/men/10.jpg' }}
                style={styles.profileAvatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {showDropdown && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setShowDropdown(false);
                navigation.navigate('SellerProfile', { userId: auth.user._id });
              }}
            >
              <Text style={styles.dropdownText}>My Listings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setShowDropdown(false);
                navigation.navigate('SellerProfile', { userId: auth.user._id });
              }}
            >
              <Text style={styles.dropdownText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              selectedCategory === cat && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === cat && styles.activeFilterText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default BazarScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBarContainer: {
    position: 'relative',
    zIndex: 999,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  profileDropdownWrapper: {
    marginLeft: 10,
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdown: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
      },
    }),
    position: 'absolute',
    top: 58,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 6,
    width: 160,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  filterBar: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 13,
    color: '#444',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 10,
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
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  sellerName: {
    fontSize: 13,
    color: '#333',
  },
});