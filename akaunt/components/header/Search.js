import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Keyboard,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { getDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import Avatar from '../Avatar';

const Search = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation(); // ✅ Navigation hook

  const handleSearch = async () => {
    if (!search) return;
    setLoad(true);
    try {
      const res = await getDataAPI(`search?username=${search}`, auth.token);
      setUsers(res.data.users);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || err.message },
      });
    } finally {
      setLoad(false);
    }
  };

  const handleClose = () => {
    setSearch('');
    setUsers([]);
    Keyboard.dismiss();
  };

  const handleSelectUser = (userId) => {
    setSearch('');
    setUsers([]);
    Keyboard.dismiss();
    navigation.navigate('Profile', { userId }); // ✅ Navigate to profile
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Search users..."
          value={search}
          onChangeText={text => setSearch(text.trim().toLowerCase())}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.close}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {(load || users.length > 0) && (
        <View style={styles.dropdown}>
          {load ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : (
            <FlatList
              data={users}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => handleSelectUser(item._id)}
                >
                  <Avatar src={item.avatar} size="medium-avatar" />
                  <Text style={styles.username}>{item.username}</Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      )}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 100,
  },
  inputRow: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  close: {
    fontSize: 20,
    color: '#888',
    marginLeft: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 10,
    zIndex: 200,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  loadingWrapper: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  username: {
    marginLeft: 10,
    fontSize: 16,
  },
});