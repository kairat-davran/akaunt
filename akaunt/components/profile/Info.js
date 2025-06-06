import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import Avatar from '../Avatar';
import FollowBtn from '../FollowBtn';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const Info = ({
  id, auth, profile, dispatch,
  onEdit, setOnEdit, showFollowers, setShowFollowers, showFollowing, setShowFollowing
}) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const newData = profile.users.filter(user => user._id === id);
      setUserData(newData);
    }
  }, [id, auth, profile.users]);

  useEffect(() => {
    dispatch({
      type: GLOBALTYPES.MODAL,
      payload: showFollowers || showFollowing || onEdit
    });
  }, [showFollowers, showFollowing, onEdit]);

  return (
    <View style={styles.info}>
      {userData.map(user => (
        <View style={styles.card} key={user._id}>
          <View style={styles.header}>
            <Avatar src={user.avatar} size="super-avatar" />
            <View style={styles.headerRight}>
              <View style={styles.usernameRow}>
                <Text style={styles.username}>{user.username}</Text>
                {user._id === auth.user._id ? (
                  <TouchableOpacity style={styles.editBtn} onPress={() => setOnEdit(true)}>
                    <Text style={styles.editText}>Edit Profile</Text>
                  </TouchableOpacity>
                ) : (
                  <FollowBtn user={user} />
                )}
              </View>
            </View>
          </View>

          <View style={styles.followRow}>
            <TouchableOpacity style={styles.followItem} onPress={() => setShowFollowers(true)}>
              <Text style={styles.followText}>{user.followers.length} Followers</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.followItem} onPress={() => setShowFollowing(true)}>
              <Text style={styles.followText}>{user.following.length} Following</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.bio}>
            <Text style={styles.name}>{user.fullname}</Text>
            <Text style={styles.meta}>
              <Text style={styles.label}>Mobile: </Text>
              <Text style={styles.danger}>{user.mobile}</Text>
            </Text>
            <Text style={styles.meta}>
              <Text style={styles.label}>Address: </Text>
              {user.address}
            </Text>
            <Text style={styles.meta}>
              <Text style={styles.label}>Email: </Text>
              {user.email}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  info: {
    padding: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    marginLeft: 15,
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: 10,
    flexShrink: 1,
  },
  editBtn: {
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  editText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  followRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  followItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    minWidth: 120,
  },
  followText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  bio: {
    marginTop: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontWeight: '500',
    color: '#333',
  },
  meta: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  danger: {
    color: 'crimson',
  },
});