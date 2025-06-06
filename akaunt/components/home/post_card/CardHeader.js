import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import Avatar from '../../Avatar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { deletePost } from '../../../redux/actions/postAction';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CardHeader = ({ post }) => {
  const auth = useSelector(state => state.auth);
  const socket = useSelector(state => state.communication.socket);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);

  const handleEditPost = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
    setVisible(false);
  };

  const handleDeletePost = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deletePost({ post, auth, socket }));
            setVisible(false);
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`https://your-domain.com/post/${post._id}`);
    Alert.alert('Link Copied', 'Post link copied to clipboard');
    setVisible(false);
  };

  const handleProfileNavigate = () => {
    navigation.navigate('Profile', { userId: post.user._id });
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.avatarRow} onPress={handleProfileNavigate}>
        <Avatar src={post.user.avatar} size="big-avatar" />
        <View style={styles.nameBox}>
          <Text style={styles.username}>{post.user.username}</Text>
          <Text style={styles.time}>{moment(post.createdAt).fromNow()}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <MaterialIcons name="more-vert" size={24} />
        </TouchableOpacity>

        <Modal
          transparent
          visible={visible}
          animationType="fade"
          onRequestClose={() => setVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setVisible(false)}
          >
            <View style={styles.modalContent}>
              {auth.user._id === post.user._id && (
                <>
                  <TouchableOpacity style={styles.menuItem} onPress={handleEditPost}>
                    <MaterialIcons name="edit" size={20} style={styles.icon} />
                    <Text style={styles.menuText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={handleDeletePost}>
                    <MaterialIcons name="delete-outline" size={20} style={styles.icon} />
                    <Text style={styles.menuText}>Delete</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity style={styles.menuItem} onPress={handleCopyLink}>
                <MaterialIcons name="link" size={20} style={styles.icon} />
                <Text style={styles.menuText}>Copy Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, { justifyContent: 'center' }]}
                onPress={() => setVisible(false)}
              >
                <Text style={[styles.menuText, { color: 'gray' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};

export default CardHeader;

const styles = StyleSheet.create({
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameBox: {
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  menuContainer: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
  },
});