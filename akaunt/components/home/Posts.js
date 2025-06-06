import React, { useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PostCard from '../PostCard';
import LoadMoreBtn from '../LoadMoreBtn';
import { getDataAPI } from '../../utils/fetchData';
import { POST_TYPES } from '../../redux/actions/postAction';
import Status from './Status';
import SuggestionsSection from './SuggestionsSection';

const Posts = () => {
  const homePosts = useSelector(state => state.homePosts);
  const auth = useSelector(state => state.auth);
  const theme = useSelector(state => state.theme);
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);

  const handleLoadMore = async () => {
    if (load) return;
    setLoad(true);
    const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token);

    dispatch({
      type: POST_TYPES.GET_POSTS,
      payload: { ...res.data, page: homePosts.page + 1 },
    });

    setLoad(false);
  };

  return (
    <FlatList
      data={homePosts.posts}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <PostCard post={item} theme={theme} showComments={false} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Status />
          {homePosts.loading ? (
            <Image
              source={require('../../assets/images/loading.gif')}
              style={styles.loading}
              resizeMode="contain"
            />
          ) : homePosts.result === 0 && homePosts.posts.length === 0 ? (
            <Text style={styles.noPost}>No Post</Text>
          ) : null}
        </View>
      }
      ListFooterComponent={
        <View>
          <SuggestionsSection />
          {load && <ActivityIndicator size="large" color="#555" />}
          <LoadMoreBtn
            result={homePosts.result}
            page={homePosts.page}
            load={load}
            handleLoadMore={handleLoadMore}
          />
        </View>
      }
    />
  );
};

export default Posts;

const styles = StyleSheet.create({
  loading: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 20,
  },
  noPost: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  header: {
    padding: 10,
  },
});