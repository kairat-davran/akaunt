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
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { getItems } from '../../redux/actions/bazarAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const categories = ['All', 'Electronics', 'Vehicles'];

const BazarScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const { items } = useSelector(state => state.bazar);

  useEffect(() => {
    if (auth.token) {
      dispatch(getItems(auth.token));
    }
  }, [auth.token]);

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
      <Image source={{ uri: item.images[0]?.url || item.images[0]?.uri }} style={styles.image} />
      <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text numberOfLines={1} style={styles.location}>{item.location}</Text>

      <TouchableOpacity
        style={styles.sellerInfo}
        onPress={() => navigation.navigate('SellerProfile', { userId: item.seller._id })}
      >
        <Image source={{ uri: item.seller.avatar }} style={styles.avatar} />
        <Text numberOfLines={1} style={styles.sellerName}>{item.seller.name || item.seller.username}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.headerBar}>
        <View style={styles.headerContent}>
          <Text style={styles.heading}>🛍️ Bazar</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => dispatch({ type: GLOBALTYPES.STATUS, payload: { type: 'bazar' } })}
              style={styles.iconButton}
            >
              <MaterialIcons name="add-box" size={26} color="#000" />
            </TouchableOpacity>
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, selectedCategory === cat && styles.activeFilter]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.filterText, selectedCategory === cat && styles.activeFilterText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TextInput
        placeholder="Search marketplace..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item._id || item.id}
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

  headerBar: {
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },

  headerContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d3557',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  postButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
  },

  postButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  dropdown: {
    position: 'absolute',
    top: 70,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 6,
    width: 160,
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
  },

  dropdownItem: {
    padding: 10,
  },

  dropdownText: {
    fontSize: 14,
    color: '#333',
  },

  filterBar: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  filterChip: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e5e5e5',
    marginRight: 10,
    elevation: Platform.OS === 'android' ? 1 : 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
    }),
  },

  activeFilter: {
    backgroundColor: '#007AFF',
  },

  filterText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },

  activeFilterText: {
    color: '#fff',
  },

  searchInput: {
    margin: 16,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    height: 260,
    overflow: 'hidden',
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