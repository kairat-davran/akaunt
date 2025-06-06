import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import FollowBtn from '../FollowBtn';
import UserCard from '../UserCard'; // assumes already converted to React Native

const Following = ({ users, setShowFollowing }) => {
  const auth = useSelector(state => state.auth);

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text style={styles.title}>Following</Text>
        <View style={styles.separator} />

        <ScrollView>
          {users.map(user => (
            <UserCard key={user._id} user={user} setShowFollowing={setShowFollowing}>
              {auth.user._id !== user._id && <FollowBtn user={user} />}
            </UserCard>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.closeBtn} onPress={() => setShowFollowing(false)}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Following;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 10,
  },
  closeText: {
    fontSize: 28,
    color: 'crimson',
  },
});