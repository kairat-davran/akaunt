import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from './Avatar';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const UserCard = ({
  children,
  user,
  border,
  handleClose,
  setShowFollowers,
  setShowFollowing,
  msg,
  disablePress = false
}) => {
  const theme = useSelector(state => state.theme);
  const navigation = useNavigation();

  const handleCloseAll = () => {
    if (handleClose) handleClose();
    if (setShowFollowers) setShowFollowers(false);
    if (setShowFollowing) setShowFollowing(false);
  };

  const handleNavigate = () => {
    handleCloseAll();
    navigation.navigate('Profile', { userId: user._id });
  };

  const showMsg = (user) => {
    return (
      <View style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
        <Text>{user.text || ''}</Text>
        {Array.isArray(user.media) && user.media.length > 0 && (
          <Text>{user.media.length} 🖼</Text>
        )}
        {user.call && (
          <Text>
            {user.call.times === 0
              ? user.call.video ? '📹 Off' : '📞 Missed'
              : user.call.video ? '📹 Answered' : '📞 Answered'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.row, border && styles.border]}>
      {!disablePress ? (
        <TouchableOpacity style={styles.info} onPress={handleNavigate}>
          <Avatar src={user.avatar} size="big-avatar" />
          <View style={{ marginLeft: 10 }}>
            <Text>{user.username}</Text>
            <Text style={{ opacity: 0.7 }}>
              {msg ? showMsg(user) : user.fullname}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[styles.info, { pointerEvents: 'none' }]}>
          <Avatar src={user.avatar} size="big-avatar" />
          <View style={{ marginLeft: 10 }}>
            <Text>{user.username}</Text>
            <Text style={{ opacity: 0.7 }}>
              {msg ? showMsg(user) : user.fullname}
            </Text>
          </View>
        </View>
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  border: {
    borderBottomWidth: 1,
    borderColor: '#ddd'
  }
});

export default UserCard;