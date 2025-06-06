import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { follow, unfollow } from '../redux/actions/profileAction';

const FollowBtn = ({ user }) => {
  const [followed, setFollowed] = useState(false);
  const [load, setLoad] = useState(false);

  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);
  const socket = useSelector(state => state.communication.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    setFollowed(auth.user.following.some(item => item._id === user._id));
  }, [auth.user.following, user._id]);

  const handleFollow = async () => {
    if (load) return;
    setFollowed(true);
    setLoad(true);
    await dispatch(follow({ users: profile.users, user, auth, socket }));
    setLoad(false);
  };

  const handleUnFollow = async () => {
    if (load) return;
    setFollowed(false);
    setLoad(true);
    await dispatch(unfollow({ users: profile.users, user, auth, socket }));
    setLoad(false);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        followed ? styles.unfollow : styles.follow
      ]}
      onPress={followed ? handleUnFollow : handleFollow}
      disabled={load}
    >
      <Text style={styles.buttonText}>
        {followed ? 'Unfollow' : 'Follow'}
      </Text>
    </TouchableOpacity>
  );
};

export default FollowBtn;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8
  },
  follow: {
    borderColor: '#007AFF',
  },
  unfollow: {
    borderColor: 'crimson',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  }
});