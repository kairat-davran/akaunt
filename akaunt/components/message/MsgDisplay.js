import React from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Avatar from '../Avatar';
import Times from './Times';
import { deleteMessages } from '../../redux/actions/messageAction';
import { imageShow, videoShow } from '../../utils/mediaShow';

const MsgDisplay = ({ user, msg, theme, data }) => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleDeleteMessages = () => {
    if (!data) return;

    Alert.alert('Delete', 'Delete this message?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: () => dispatch(deleteMessages({ msg, data, auth })),
      },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Avatar src={user.avatar} size="small-avatar" />
        <Text style={styles.username}>{user.username}</Text>
      </View>

      <View style={[styles.content, theme && styles.dark]}>
        {user._id === auth.user._id && (
          <TouchableOpacity
            onPress={handleDeleteMessages}
            style={styles.deleteBtn}
          >
            <MaterialIcons name="delete" size={20} color="crimson" />
          </TouchableOpacity>
        )}

        {msg.text && (
          <Text style={[styles.text, theme && { color: '#fff' }]}>{msg.text}</Text>
        )}

        {msg.media.map((item, index) => (
          <View key={index} style={styles.media}>
            {item.url.match(/video/i)
              ? videoShow(item.url, theme)
              : imageShow(item.url, theme)}
          </View>
        ))}

        {msg.call && (
          <View style={styles.callBox}>
            <MaterialIcons
              name={
                msg.call.times === 0
                  ? msg.call.video ? 'videocam-off' : 'phone-disabled'
                  : msg.call.video ? 'video-call' : 'call'
              }
              size={28}
              color={msg.call.times === 0 ? 'crimson' : 'green'}
            />
            <View>
              <Text style={styles.callType}>
                {msg.call.video ? 'Video Call' : 'Audio Call'}
              </Text>
              <Text style={styles.callTime}>
                {msg.call.times > 0
                  ? <Times total={msg.call.times} />
                  : new Date(msg.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.timestamp}>
        {new Date(msg.createdAt).toLocaleString()}
      </Text>
    </View>
  );
};

export default MsgDisplay;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  username: {
    fontWeight: '600',
    fontSize: 13,
  },
  content: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 12,
    position: 'relative',
    elevation: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3, // fallback for Android
      },
    }),
  },
  dark: {
    backgroundColor: '#333',
  },
  deleteBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    elevation: 4,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
  media: {
    marginTop: 5,
  },
  callBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginTop: 8,
  },
  callType: {
    fontWeight: '600',
  },
  callTime: {
    fontSize: 12,
    color: '#666',
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
    marginTop: 3,
  },
});