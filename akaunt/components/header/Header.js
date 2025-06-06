import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import Avatar from '../Avatar';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { isReadNotify, deleteAllNotifies } from '../../redux/actions/notifyAction';

const Header = ({ navigation }) => {
  const [notifyVisible, setNotifyVisible] = useState(false);
  const notify = useSelector(state => state.notify);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleIsRead = (msg) => {
    if (!msg.isRead) dispatch(isReadNotify({ msg, auth }));
  };

  const handleDeleteAll = () => {
    const unread = notify.data.filter(n => !n.isRead);
    if (unread.length === 0) {
      dispatch(deleteAllNotifies(auth.token));
    } else {
      Alert.alert(
        'Delete All Notifications',
        `You have ${unread.length} unread. Are you sure?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete All', onPress: () => dispatch(deleteAllNotifies(auth.token)), style: 'destructive' },
        ]
      );
    }
  };

  const renderNotifyItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        handleIsRead(item);
        setNotifyVisible(false);
        navigation.navigate('PostDetail', { postId: item.url?.split('/').pop() });
      }}
      style={styles.notifyItem}
    >
      <Avatar src={item.user.avatar} size="medium-avatar" />
      <View style={styles.notifyContent}>
        <Text style={styles.notifyText}>
          <Text style={styles.notifyUser}>{item.user.username} </Text>
          {item.text}
        </Text>
        {item.content && (
          <Text style={styles.notifyContentPreview}>
            {item.content.slice(0, 40)}...
          </Text>
        )}
        <Text style={styles.notifyTime}>{moment(item.createdAt).fromNow()}</Text>
      </View>
      {item.image && <Avatar src={item.image} size="small-avatar" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.row}>
        <Text style={styles.logo}>akaunt</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true })}>
            <MaterialIcons name="add-box" size={26} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setNotifyVisible(true)} style={styles.notifyWrapper}>
            <MaterialIcons
              name="notifications"
              size={26}
              color={notify.data.length > 0 ? 'crimson' : '#333'}
            />
            {notify.data.length > 0 && (
              <View style={styles.notifyBadge}>
                <Text style={styles.notifyBadgeText}>{notify.data.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
            <MaterialIcons name="chat" size={26} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={notifyVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setNotifyVisible(false)}>
          <View style={styles.notifyModal}>
            <Text style={styles.modalTitle}>Notifications</Text>
            {notify.data.length === 0 ? (
              <Text style={styles.noNotification}>No notifications</Text>
            ) : (
              <>
                <FlatList
                  data={notify.data}
                  keyExtractor={(item, idx) => `${item._id || idx}`}
                  renderItem={renderNotifyItem}
                />
                <TouchableOpacity onPress={handleDeleteAll} style={styles.deleteAllBtn}>
                  <Text style={styles.deleteAllText}>Delete All</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#f8f9fa',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 3,
    zIndex: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notifyWrapper: {
    position: 'relative',
  },
  notifyBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: 'crimson',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  notifyBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifyModal: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  notifyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginRight: 12,
  },
  notifyContent: {
    flex: 1,
    marginHorizontal: 10,
  },
  notifyUser: {
    fontWeight: 'bold',
  },
  notifyText: {
    fontSize: 14,
  },
  notifyContentPreview: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  notifyTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  noNotification: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
  deleteAllBtn: {
    marginTop: 10,
    alignSelf: 'center',
    padding: 8,
  },
  deleteAllText: {
    color: 'crimson',
    fontWeight: 'bold',
  },
});