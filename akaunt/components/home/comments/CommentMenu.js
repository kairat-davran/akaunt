import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { deleteComment } from '../../../redux/actions/commentAction';

const CommentMenu = ({ post, comment, setOnEdit }) => {
  const auth = useSelector(state => state.auth);
  const socket = useSelector(state => state.communication.socket);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const canDelete =
    post.user._id === auth.user._id || comment.user._id === auth.user._id;

  const handleRemove = () => {
    Alert.alert(
      'Remove Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteComment({ post, auth, comment, socket }));
            setVisible(false);
          },
        },
      ]
    );
  };

  const renderMenuItems = () => {
    const isAuthor = comment.user._id === auth.user._id;
    const isPostOwner = post.user._id === auth.user._id;

    return (
      <View style={styles.menuContainer}>
        {isAuthor && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setOnEdit(true);
              setVisible(false);
            }}
          >
            <MaterialIcons name="create" size={20} style={styles.icon} />
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
        )}
        {(isAuthor || isPostOwner) && (
          <TouchableOpacity style={styles.menuItem} onPress={handleRemove}>
            <MaterialIcons name="delete-outline" size={20} style={styles.icon} />
            <Text style={styles.menuText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!canDelete) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <MaterialIcons name="more-vert" size={22} />
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
          <View style={styles.bottomSheet}>
            {renderMenuItems()}
            <View style={styles.divider} />
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CommentMenu;

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 10,
  },
  menuContainer: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 10,
    color: '#444',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 8,
  },
  cancelBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'gray',
  },
});