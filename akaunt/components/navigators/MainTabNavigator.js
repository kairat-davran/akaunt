import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';

import HomeScreen from '../../pages/HomeScreen';
import DiscoverScreen from '../../pages/DiscoverScreen';
import ProfileScreen from '../../pages/profile/ProfileScreen';
import EventScreen from '../../pages/event/EventScreen';
import BazarScreen from '../../pages/bazar/BazarScreen';

import { logout } from '../../redux/actions/authAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, navigation }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const auth = useSelector(state => state.auth);
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();

  const handleProfile = () => {
    setDropdownVisible(false);
    navigation.navigate('Profile', { userId: auth.user._id });
  };

  const handleLogout = () => {
    setDropdownVisible(false);
    dispatch(logout(navigation));
  };

  return (
    <View style={[styles.menu, theme && { backgroundColor: '#111' }]}>
      {['Home', 'Discover', 'Bazar', 'Events'].map((name, idx) => (
        <TouchableOpacity key={name} onPress={() => navigation.navigate(name)}>
          <MaterialIcons
            name={
              name === 'Discover'
                ? 'search'
                : name === 'Bazar'
                ? 'storefront'
                : name === 'Events'
                ? 'event'
                : 'home'
            }
            size={28}
            color={state.index === idx ? '#007AFF' : theme ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={() => setDropdownVisible(prev => !prev)}>
        <MaterialIcons
          name="person"
          size={28}
          color={state.index === 4 ? '#007AFF' : theme ? '#fff' : '#000'}
        />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={[styles.dropdown, theme && { backgroundColor: '#222' }]}>
          <Pressable onPress={handleProfile} style={styles.dropdownItem}>
            <Text style={[styles.dropdownText, theme && { color: '#fff' }]}>Profile</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              dispatch({ type: GLOBALTYPES.THEME, payload: !theme });
              setDropdownVisible(false);
            }}
            style={styles.dropdownItem}
          >
            <Text style={[styles.dropdownText, theme && { color: '#fff' }]}>
              {theme ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </Pressable>
          <Pressable onPress={handleLogout} style={styles.dropdownItem}>
            <Text style={[styles.dropdownText, { color: 'crimson' }]}>Logout</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const MainTabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={props => <CustomTabBar {...props} />}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Discover" component={DiscoverScreen} />
    <Tab.Screen name="Bazar" component={BazarScreen} />
    <Tab.Screen name="Events" component={EventScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainTabNavigator;

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  dropdown: {
    position: 'absolute',
    bottom: 60,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 5,
    elevation: 6,
    width: 140,
    zIndex: 100,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 14,
  },
});