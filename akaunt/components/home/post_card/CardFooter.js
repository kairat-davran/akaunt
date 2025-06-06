import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  likePost,
  unLikePost,
  savePost,
  unSavePost
} from '../../../redux/actions/postAction';

import LikeButton from '../../LikeButton';
import ShareModal from '../../ShareModal';
import SendIcon from '../../../assets/images/send.png'; // use PNG version
import { BASE_URL } from '../../../utils/config';

const CardFooter = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);

  const auth = useSelector(state => state.auth);
  const socket = useSelector(state => state.communication.socket);
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    setIsLike(post.likes.some(like => like._id === auth.user._id));
  }, [post.likes, auth.user._id]);

  useEffect(() => {
    setSaved(auth.user.saved.includes(post._id));
  }, [auth.user.saved, post._id]);

  const handleLike = async () => {
    if (loadLike) return;
    setIsLike(true);
    setLoadLike(true);
    await dispatch(likePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleUnLike = async () => {
    if (loadLike) return;
    setIsLike(false);
    setLoadLike(true);
    await dispatch(unLikePost({ post, auth, socket }));
    setLoadLike(false);
  };

  const handleSavePost = async () => {
    if (saveLoad) return;
    setSaveLoad(true);
    await dispatch(savePost({ post, auth }));
    setSaveLoad(false);
  };

  const handleUnSavePost = async () => {
    if (saveLoad) return;
    setSaveLoad(true);
    await dispatch(unSavePost({ post, auth }));
    setSaveLoad(false);
  };

  return (
    <View style={styles.footer}>
      <View style={styles.iconMenu}>
        <View style={styles.iconWrapper}>
          {loadLike ? (
            <ActivityIndicator size="small" color="#888" />
          ) : (
            <LikeButton
              isLike={isLike}
              handleLike={handleLike}
              handleUnLike={handleUnLike}
            />
          )}
        </View>

        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post._id })}>
            <MaterialIcons name="chat-bubble-outline" size={24} color={theme ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>

        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={() => setIsShare(!isShare)}>
            <Image source={SendIcon} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.iconWrapper}>
          {saveLoad ? (
            <ActivityIndicator size="small" color="#888" />
          ) : (
            <TouchableOpacity onPress={saved ? handleUnSavePost : handleSavePost}>
              <MaterialIcons
                name={saved ? 'bookmark' : 'bookmark-border'}
                size={24}
                color={theme ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.counts}>
        <Text style={styles.count}>{post.likes.length} likes</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post._id })}>
          <Text style={styles.count}>{post.comments.length} comments</Text>
        </TouchableOpacity>
      </View>

      {isShare && (
       <ShareModal
          url={`${BASE_URL}/post/${post._id}`}
          theme={theme}
          visible={isShare}
          onClose={() => setIsShare(false)}
        />
      )}
    </View>
  );
};

export default CardFooter;

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  iconMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    paddingHorizontal: 6,
  },
  icon: {
    fontSize: 18,
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
  counts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  count: {
    fontSize: 14,
    color: '#555',
  },
});