import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Info from '../../components/profile/Info';
import Posts from '../../components/profile/Posts';
import Saved from '../../components/profile/Saved';
import EditProfile from '../../components/profile/EditProfile';
import Followers from '../../components/profile/Followers';
import Following from '../../components/profile/Following';

import { getProfileUsers } from '../../redux/actions/profileAction';

const ProfileScreen = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { userId: id } = params;

  const profile = useSelector(state => state.profile);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const isSelf = id === auth.user._id;

  const [saveTab, setSaveTab] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (isSelf) {
      setUserData(auth.user);
    } else {
      const newData = profile.users.find(user => user._id === id);
      setUserData(newData || {});
    }
  }, [id, auth.user, profile.users]);

  useEffect(() => {
    if (!profile.ids.includes(id)) {
      dispatch(getProfileUsers({ id, auth }));
    }
  }, [id]);

  return (
    <ScrollView style={styles.profile}>
      <View style={styles.header}>
        {!isSelf && (
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>
        )}

        <Text style={styles.username}>{userData.username || 'Profile'}</Text>

        {isSelf && (
          <TouchableOpacity
            style={styles.settingsIcon}
            onPress={() => setOnEdit(true)}
          >
            <MaterialIcons name="settings" size={26} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.info}>
        <Info
          auth={auth}
          profile={profile}
          dispatch={dispatch}
          id={id}
          onEdit={onEdit}
          setOnEdit={setOnEdit}
          showFollowers={showFollowers}
          setShowFollowers={setShowFollowers}
          showFollowing={showFollowing}
          setShowFollowing={setShowFollowing}
        />
      </View>

      {isSelf && (
        <View style={styles.profile_tab}>
          <TouchableOpacity
            style={[styles.tabButton, !saveTab && styles.activeTab]}
            onPress={() => setSaveTab(false)}
          >
            <Text style={styles.tabText}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, saveTab && styles.activeTab]}
            onPress={() => setSaveTab(true)}
          >
            <Text style={styles.tabText}>Saved</Text>
          </TouchableOpacity>
        </View>
      )}

      {profile.loading ? (
        <Image
          source={require('../../assets/images/loading.gif')}
          style={styles.loading}
        />
      ) : saveTab && isSelf ? (
        <Saved auth={auth} dispatch={dispatch} />
      ) : (
        <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
      )}

      <Modal visible={onEdit} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <EditProfile setOnEdit={setOnEdit} />
          </View>
        </View>
      </Modal>

      <Modal visible={showFollowers} animationType="fade" transparent>
        <Followers users={userData.followers} setShowFollowers={setShowFollowers} />
      </Modal>

      <Modal visible={showFollowing} animationType="fade" transparent>
        <Following users={userData.following} setShowFollowing={setShowFollowing} />
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profile: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
    elevation: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  settingsIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  info: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 3,
    boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
  },
  profile_tab: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 16,
    gap: 12,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  loading: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginVertical: 30,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '94%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 8,
    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
  },
});