import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { getPost } from '../../redux/actions/postAction';
import PostCard from '../../components/PostCard';

const PostDetailScreen = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { postId } = params;

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const detailPost = useSelector(state => state.detailPost);

  const [post, setPost] = useState([]);

  useEffect(() => {
    dispatch(getPost({ detailPost, id: postId, auth }));

    if (detailPost.length > 0) {
      const match = detailPost.filter(p => p._id === postId);
      setPost(match);
    }
  }, [dispatch, postId, detailPost, auth]);

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Back Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Post</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {post.length === 0 ? (
          <ActivityIndicator size="large" color="crimson" />
        ) : (
          post.map(item => (
            <PostCard key={item._id} post={item} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  container: {
    padding: 0,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});