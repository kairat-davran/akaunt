import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { getDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { MESS_TYPES, getConversations } from '../../redux/actions/messageAction';
import UserCard from '../../components/UserCard';

const MessageScreen = () => {
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth);
  const message = useSelector(state => state.message);
  const online = useSelector(state => state.online);
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [searchUsers, setSearchUsers] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!message.firstLoad) {
      dispatch(getConversations({ auth }));
    }
  }, [dispatch, auth, message.firstLoad]);

  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversations({ auth, page }));
    }
  }, [message.resultUsers, page, auth, dispatch]);

  useEffect(() => {
    if (message.firstLoad) {
      dispatch({ type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online });
    }
  }, [online, message.firstLoad, dispatch]);

  const handleSearch = async () => {
    if (!search) return setSearchUsers([]);
    try {
      const res = await getDataAPI(`search?username=${search}`, auth.token);
      setSearchUsers(res.data.users);
      setShowSearchModal(true);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || 'Search failed.' },
      });
    }
  };

  const handleAddUser = (user) => {
    setSearch('');
    setSearchUsers([]);
    setShowSearchModal(false);

    dispatch({
      type: MESS_TYPES.ADD_USER,
      payload: { ...user, text: '', media: [] },
    });

    dispatch({
      type: MESS_TYPES.CHECK_ONLINE_OFFLINE,
      payload: online,
    });

    navigation.navigate('Conversation', { userId: user._id });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Messages</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Enter to Search..."
          style={styles.input}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Conversation List */}
      <FlatList
        data={message.users}
        keyExtractor={(item) => item._id}
        onEndReached={() => setPage(prev => prev + 1)}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleAddUser(item)}
            style={styles.userItem}
          >
            <UserCard user={item} msg={true} />
            {item.online ||
            auth.user.following.find(f => f._id === item._id) ? (
              <Text style={[styles.onlineIndicator, { color: 'green' }]}>●</Text>
            ) : <Text style={[styles.onlineIndicator, { color: '#aaa' }]}>●</Text>}
          </TouchableOpacity>
        )}
      />

      {/* Search Modal */}
      <Modal visible={showSearchModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search Results</Text>

            <FlatList
              data={searchUsers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleAddUser(item)}
                  style={styles.userItem}
                >
                  <UserCard user={item} msg={true} handleClose={() => setShowSearchModal(false)} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResult}>No users found.</Text>
              }
            />

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowSearchModal(false)}
            >
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
  },
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  userItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  onlineIndicator: {
    fontSize: 14,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 10,
  },
  modalCloseText: {
    fontSize: 28,
    color: '#888',
  },
  noResult: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 20,
  },
});